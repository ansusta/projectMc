const supabase = require("../db");

exports.createMagasin = async (req, res) => {
  try {
    const { nom_magasin, description } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1]; 
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return res.status(401).json({ error: "Invalid token" });

    const userId = user.id;

    const { data: profile, error: profileError } = await supabase
      .from("utilisateur")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    if (profile.role === "vendeur") {
      return res.status(400).json({ error: "You already have a store" });
    }

    if (profile.role !== "client") {
      return res.status(403).json({ error: "Only clients can create a store" });
    }

    
    const { error: upgradeError } = await supabase.rpc("upgrade_to_vendeur", {
      user_id: userId
    });
    if (upgradeError) return res.status(400).json({ error: upgradeError.message });

    
    const { data: magasin, error: magasinError } = await supabase
      .from("magasin")
      .insert([{
        nom_magasin,
        description,
        id_vendeur: userId,
        statut: "nonValide" 
      }])
      .select()
      .single();

    if (magasinError) return res.status(400).json({ error: magasinError.message });

    res.status(201).json({
      message: "Store created, role upgraded to vendeur",
      magasin
    });

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

exports.getPendingStores = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("magasin")
      .select("*")
      .eq("statut", "nonValide");

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ stores: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};