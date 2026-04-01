const supabase = require("../db");

// NOTE: The schema's `signalement` table only has id_produit FK (no vendeur FK).
// Reporting a vendor directly is not in the DB yet.
// If needed, add: ALTER TABLE public.signalement ADD COLUMN id_vendeur uuid REFERENCES public.vendeur(id);

exports.signalerProduit = async (req, res) => {
  try {
    const { id_produit, motif } = req.body;

    if (!id_produit || !motif) {
      return res.status(400).json({ error: "id_produit and motif are required" });
    }

    // Check product exists
    const { data: produit, error: produitError } = await supabase
      .from("produit")
      .select("id")
      .eq("id", id_produit)
      .single();

    if (produitError || !produit) {
      return res.status(404).json({ error: "Produit not found" });
    }

    // Prevent duplicate reports from same client on same product
    const { data: existing } = await supabase
      .from("signalement")
      .select("id")
      .eq("id_client",  req.user.id)
      .eq("id_produit", id_produit)
      .single();

    if (existing) {
      return res.status(400).json({ error: "Vous avez déjà signalé ce produit" });
    }

    const { data, error } = await supabase
      .from("signalement")
      .insert([{
        id_client:  req.user.id,
        id_produit,
        motif
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({
      message:         "Produit signalé avec succès",
      signalement_id:  data.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};