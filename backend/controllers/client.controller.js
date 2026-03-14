
const supabase = require("../db");

exports.getAllClients = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("client")
      .select(`
        id,
        statut,
        utilisateur (
          email,
          nom_utilisateur,
          role,
          date_creation
        )
      `);

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClientStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    if (!["actif", "suspendu", "banni"].includes(statut)) {
      return res.status(400).json({ error: "Invalid statut value" });
    }

    const { data, error } = await supabase
      .from("client")
      .update({ statut })
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: "Client statut updated", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("client")
      .select(`
        id,
        statut,
        utilisateur (
          email,
          nom_utilisateur,
          role,
          date_creation
        )
      `)
      .eq("id", id)
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};