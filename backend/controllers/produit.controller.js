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