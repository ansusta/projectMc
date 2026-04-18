const supabase = require("../db");

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

    // Filter by search string on nom_produit
    if (search) {
      query = query.ilike("nom_produit", `%${search}%`);
    }

    // Filter by category name through the joined tables
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

    // Fetch average rating
    const { data: avisData } = await supabase
      .from("avis")
      .select("note")
      .eq("produit_id", id);

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
 
    // Remove from cart and favorites first to avoid FK violations
    await supabase.from("item").delete().eq("id_produit", id);
    await supabase.from("favoriser").delete().eq("id_produit", id);
    await supabase.from("avis").delete().eq("id_produit", id);
    await supabase.from("signalement").delete().eq("id_produit", id);
 
    const { error } = await supabase.from("produit").delete().eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
 
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products for a specific store
exports.getByMagasin = async (req, res) => {
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
          nom_magasin
        )
      `)
      .eq("id_magasin", id)
      .order("date_ajout", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ produits: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new product
exports.createProduit = async (req, res) => {
  try {
    const { nom_produit, description, prix, qte_dispo, image_url, id_magasin, id_type } = req.body;

    if (!nom_produit || !prix || !id_magasin) {
      return res.status(400).json({ error: "nom_produit, prix, and id_magasin are required" });
    }

    const { data, error } = await supabase
      .from("produit")
      .insert([{
        nom_produit,
        description: description || '',
        prix: parseFloat(prix),
        qte_dispo: parseInt(qte_dispo) || 0,
        image_url: image_url || null,
        id_magasin,
        id_type: id_type || null,
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "Produit créé avec succès", produit: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a product
exports.updateProduit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {};

    const allowed = ['nom_produit', 'description', 'prix', 'qte_dispo', 'image_url', 'id_type'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    if (updates.prix) updates.prix = parseFloat(updates.prix);
    if (updates.qte_dispo) updates.qte_dispo = parseInt(updates.qte_dispo);

    const { data, error } = await supabase
      .from("produit")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Produit mis à jour", produit: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};