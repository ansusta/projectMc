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
        admin ( id )
      `);

    if (error) return res.status(400).json({ error: error.message });

    
    const enriched = await Promise.all(
      data.map(async (user) => {
        if (user.role === "vendeur") {
          const { data: vendeurData } = await supabase
            .from("vendeur")
            .select("id")
            .eq("id", user.id)
            .single();
          return { ...user, vendeur: vendeurData };
        }
        return { ...user, vendeur: null };
      })
    );

    res.json(enriched);
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
        admin ( id )
      `)
      .eq("id", id)
      .single();

    if (error) return res.status(400).json({ error: error.message });

    let vendeur = null;
    if (data.role === "vendeur") {
      const { data: vendeurData } = await supabase
        .from("vendeur")
        .select("id")
        .eq("id", id)
        .single();
      vendeur = vendeurData;
    }

    res.json({ ...data, vendeur });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
