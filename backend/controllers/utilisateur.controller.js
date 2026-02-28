const supabase = require("../db");

exports.createUtilisateur = async (req, res) => {
  try {
    const { id, nom_utilisateur, role } = req.body;
    const { data, error } = await supabase
      .from("utilisateur")
      .insert([{ id, nom_utilisateur, role }]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUtilisateurs = async (req, res) => {
  try {
    const { data, error } = await supabase.from("utilisateur").select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};