const supabase = require("../db");
// Import cloudinary so we can delete images if store creation fails
const { cloudinary } = require("../middleware/upload");

// ==========================================
// SELLER ROUTES
// ==========================================

exports.createMagasin = async (req, res) => {
  try {
    const { nom_magasin, description } = req.body;
    
    // We now use req.user.id provided by your auth middleware!
    const userId = req.user.id;

    // 1. Check user role
    const { data: profile, error: profileError } = await supabase
      .from("utilisateur")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) return res.status(400).json({ error: profileError.message });
    if (profile.role === "vendeur") return res.status(400).json({ error: "You already have a store" });
    if (profile.role !== "client") return res.status(403).json({ error: "Only clients can create a store" });

    // 2. Process the uploaded image (if any)
    let photo_url = null;
    if (req.file) {
      photo_url = req.file.secure_url || req.file.path;
    }

    // 3. Upgrade role to vendeur via your custom RPC
    const { error: upgradeError } = await supabase.rpc("upgrade_to_vendeur", {
      user_id: userId
    });
    
    if (upgradeError) {
        // If upgrade fails, delete the uploaded image so it doesn't take up space
        if (req.file) {
            const urlParts = photo_url.split("/");
            await cloudinary.uploader.destroy(`${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1].split(".")[0]}`).catch(() => {});
        }
        return res.status(400).json({ error: upgradeError.message });
    }

    // 4. Create the store
    const { data: magasin, error: magasinError } = await supabase
      .from("magasin")
      .insert([{
        nom_magasin,
        description,
        photo_url,           // Added the Cloudinary URL here!
        id_vendeur: userId,
        statut: "nonValide" 
      }])
      .select()
      .single();

    if (magasinError) {
        // Cleanup image if DB insert fails
        if (req.file) {
            const urlParts = photo_url.split("/");
            await cloudinary.uploader.destroy(`${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1].split(".")[0]}`).catch(() => {});
        }
        return res.status(400).json({ error: magasinError.message });
    }

    res.status(201).json({
      message: "Store created, role upgraded to vendeur",
      magasin
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// NEW: Update Store Details & Photo
exports.updateMagasin = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    // Verify the store belongs to the logged-in user before updating
    const { data: existingMagasin, error: checkError } = await supabase
      .from("magasin")
      .select("id")
      .eq("id_vendeur", userId)
      .single();

    if (checkError || !existingMagasin) {
      return res.status(404).json({ error: "Magasin introuvable ou accès refusé." });
    }

    // Process new image if uploaded
    if (req.file) {
      updates.photo_url = req.file.secure_url || req.file.path;
    }

    // Update the store
    const { data, error } = await supabase
      .from("magasin")
      .update(updates)
      .eq("id_vendeur", userId)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Magasin mis à jour avec succès", magasin: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMagasinByVendeur = async (req, res) => {
  try {
    const { id } = req.params; 

    const { data, error } = await supabase
      .from("magasin")
      .select(`
        *,
        produit ( id, nom_produit, prix, qte_dispo )
      `)
      .eq("id_vendeur", id)
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================================
// ADMIN & PUBLIC ROUTES
// ==========================================

exports.getAllMagasins = async (req, res) => {
  try {
    const { data: magasins, error } = await supabase
      .from("magasin")
      .select("*");

    if (error) return res.status(400).json({ error: error.message });

    const enriched = await Promise.all(
      magasins.map(async (magasin) => {
        const { data: utilisateur } = await supabase
          .from("utilisateur")
          .select("nom_utilisateur, email, photo_url")
          .eq("id", magasin.id_vendeur)
          .single();

        return {
          ...magasin,
          vendeur_nom:   utilisateur?.nom_utilisateur ?? null,
          vendeur_email: utilisateur?.email ?? null,
          vendeur_photo: utilisateur?.photo_url ?? null,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMagasinStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!["actif", "suspendu", "nonValide", "fermer"].includes(statut)) {
      return res.status(400).json({ error: "Invalid statut" });
    }

    const { data, error } = await supabase
      .from("magasin")
      .update({ statut })
      .eq("id", id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Magasin not found or access denied" });
    }

    res.json({ message: "Magasin statut updated", data: data[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.suspendMagasin = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("magasin")
      .update({ statut: "suspendu" })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) return res.status(404).json({ error: "Magasin not found" });

    res.status(200).json({ message: "Magasin suspendu avec succès", magasin: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};