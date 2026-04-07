const supabase = require("../db");

exports.getAvisByProduit = async (req, res) => {
  try {
    const { id_produit } = req.params;

const { data, error } = await supabase
  .from("avis")
  .select(`
    id,
    note,
    contenu,
    date,
    auteur:client!avis_id_client_fkey (
      utilisateur!client_id_fkey ( 
        nom_utilisateur, 
        photo_url 
      )
    )
  `)
  .eq("id_produit", id_produit)
  .order("date", { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    const nb_avis   = data.length;
    const note_moyenne = nb_avis > 0
      ? (data.reduce((sum, a) => sum + a.note, 0) / nb_avis).toFixed(1)
      : null;

    res.status(200).json({ avis: data, note_moyenne, nb_avis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitAvis = async (req, res) => {
  try {
    const { id_produit, note, contenu } = req.body;

    if (!id_produit || !note) {
      return res.status(400).json({ error: "id_produit and note are required" });
    }
    if (note < 1 || note > 5) {
      return res.status(400).json({ error: "note must be between 1 and 5" });
    }

    // Check the client actually bought this product (optional but good practice)
    // One review per client per product — check for existing
    const { data: existing } = await supabase
      .from("avis")
      .select("id")
      .eq("id_client",  req.user.id)
      .eq("id_produit", id_produit)
      .single();

    if (existing) {
      // Update existing review
      const { data, error } = await supabase
        .from("avis")
        .update({ note, contenu: contenu ?? null })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: "Avis mis à jour", avis: data });
    }

    const { data, error } = await supabase
      .from("avis")
      .insert([{
        id_client:  req.user.id,
        id_produit,
        note,
        contenu: contenu ?? null
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "Avis soumis avec succès", avis: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};