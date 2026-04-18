const supabase = require("../db");
const { cloudinary } = require("../middleware/upload");

exports.searchProduits = async (req, res) => {
  try {
    const { search, categorie, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from("produit")
      .select(`
        id,
        nom_produit,
        description,
        prix,
        qte_dispo,
        image_url,
        date_ajout,
        type (
          nom,
          categorie ( nom )
        ),
        magasin (
          nom_magasin
        )
      `, { count: "exact" });

    if (search) {
      query = query.ilike("nom_produit", `%${search}%`);
    }

    if (categorie) {
      query = query.eq("type.categorie.nom", categorie);
    }

    const { data, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({
      produits: data,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProduitById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("produit")
      .select(`
        id,
        nom_produit,
        description,
        prix,
        qte_dispo,
        image_url,
        date_ajout,
        type (
          nom,
          categorie ( nom )
        ),
        magasin ( 
          id, 
          nom_magasin, 
          description 
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) return res.status(404).json({ error: "Produit not found" });

    // FIX: Using id_produit to match your schema
    const { data: avisData } = await supabase
      .from("avis")
      .select("note")
      .eq("id_produit", id); 

    const nb_avis = avisData?.length || 0;
    const avgNote = nb_avis > 0
        ? (avisData.reduce((sum, a) => sum + a.note, 0) / nb_avis).toFixed(1)
        : null;

    res.status(200).json({ 
      produit: { 
        ...data, 
        note_moyenne: avgNote, 
        nb_avis: nb_avis 
      } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteProduit = async (req, res) => {
  try {
    const { id } = req.params;

    // --- 🛡️ SECURITY CHECK START ---
    // 1. Fetch product to get the image URL AND the store ID
    const { data: produit, error: fetchError } = await supabase
      .from("produit")
      .select("image_url, id_magasin") // Added id_magasin here
      .eq("id", id)
      .single();

    if (fetchError || !produit) {
      return res.status(404).json({ error: "Produit introuvable" });
    }

    // 2. Verify the logged-in user owns this store
    const { data: magasinCheck, error: magError } = await supabase
      .from("magasin")
      .select("id_vendeur")
      .eq("id", produit.id_magasin)
      .single();

    if (magError || !magasinCheck || magasinCheck.id_vendeur !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé : vous ne possédez pas ce magasin." });
    }
    // --- 🛡️ SECURITY CHECK END ---

    // Clean up Cloudinary if an image exists
    if (produit.image_url) {
      try {
        const urlParts = produit.image_url.split("/");
        const folder = urlParts[urlParts.length - 2]; 
        const fileName = urlParts[urlParts.length - 1].split(".")[0]; 
        const publicId = `${folder}/${fileName}`;

        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.error("Cloudinary Cleanup Failed:", cloudErr.message);
      }
    }

    // Delete from related tables
    await Promise.all([
      supabase.from("item").delete().eq("id_produit", id),
      supabase.from("favoriser").delete().eq("id_produit", id),
      supabase.from("avis").delete().eq("id_produit", id),
      supabase.from("signalement").delete().eq("id_produit", id)
    ]);

    // Final Database deletion
    const { error: deleteError } = await supabase
      .from("produit")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.status(200).json({ message: "Produit et image supprimés avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduit = async (req, res) => {
  try {
    const { nom_produit, description, prix, qte_dispo, type_id, magasin_id } = req.body;
    
    // 1. Basic validation
    if (!nom_produit || !prix || !qte_dispo || !magasin_id || !type_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // --- 🛡️ SECURITY CHECK START ---
    // 2. Verify the logged-in user owns the store they are trying to add a product to
    const { data: magasinCheck, error: magError } = await supabase
      .from("magasin")
      .select("id_vendeur")
      .eq("id", magasin_id)
      .single();

    if (magError || !magasinCheck || magasinCheck.id_vendeur !== req.user.id) {
      // 🚨 CRITICAL: The image was already uploaded by the middleware. We must delete it!
      if (req.file) {
        const image_url = req.file.secure_url || req.file.path;
        const urlParts = image_url.split("/");
        const folder = urlParts[urlParts.length - 2];
        const fileName = urlParts[urlParts.length - 1].split(".")[0];
        // Silently delete the unauthorized image
        await cloudinary.uploader.destroy(`${folder}/${fileName}`).catch(() => {});
      }
      return res.status(403).json({ error: "Accès refusé : vous ne possédez pas ce magasin." });
    }
    // --- 🛡️ SECURITY CHECK END ---

    // 3. Process the image URL
    let image_url = req.body.image_url || null; 
    if (req.file) {
        image_url = req.file.secure_url || req.file.path || null;
    }

    // 4. Insert into Database
    const { data, error } = await supabase
      .from("produit")
      .insert([
        {
          nom_produit,
          description,
          prix: parseFloat(prix),
          qte_dispo: parseInt(qte_dispo),
          image_url: image_url,
          id_type: type_id,    
          id_magasin: magasin_id 
        }
      ])
      .select();

    if (error) throw error; // Send to catch block

    res.status(201).json({ message: "Produit ajouté avec succès", produit: data[0] });
  } catch (err) {
    console.error("Upload Error Details:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // --- 🛡️ SECURITY CHECK START ---
    // 1. Find the product's store (id_magasin)
    const { data: produitCheck, error: checkError } = await supabase
      .from("produit")
      .select("id_magasin")
      .eq("id", id)
      .single();

    if (checkError || !produitCheck) return res.status(404).json({ error: "Produit introuvable" });

    // 2. Verify the logged-in user owns this store
    const { data: magasinCheck, error: magError } = await supabase
      .from("magasin")
      .select("id_vendeur")
      .eq("id", produitCheck.id_magasin)
      .single();

    if (magError || !magasinCheck || magasinCheck.id_vendeur !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé : vous ne possédez pas ce magasin." });
    }
    // --- 🛡️ SECURITY CHECK END ---

    // Process image update if a new file is uploaded
    if (req.file) {
        updates.image_url = req.file.secure_url || req.file.path;
    }

    const { data, error } = await supabase
      .from("produit")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Produit mis à jour avec succès", produit: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};