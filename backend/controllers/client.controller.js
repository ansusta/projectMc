const supabase = require("../db");

exports.createClient = async (req, res) => {
  try {
    const { id, statut } = req.body;

    const { data, error } = await supabase
      .from("client")
      .insert([{ id, statut }]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("client")
      .select("*");

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};