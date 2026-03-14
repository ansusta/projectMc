const supabase = require("../db");


exports.getAllUtilisateurs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("utilisateur")
      .select(`
        id,
        email,
        nom_utilisateur,
        role,
        date_creation,
        client ( statut ),
        vendeur ( id ),
        admin ( id )
      `);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUtilisateurById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("utilisateur")
      .select(`
        id,
        email,
        nom_utilisateur,
        role,
        date_creation,
        client ( statut ),
        vendeur ( id ),
        admin ( id )
      `)
      .eq("id", id)
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["client", "vendeur", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const { data, error } = await supabase
      .from("utilisateur")
      .update({ role })
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Role updated", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};