// auth.controller.js
const supabase = require("../db");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, username, role = "client" } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Email, password and username are required" });
    }

    if (!["client", "vendeur", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    // 1. Sign up — trigger auto-creates utilisateur + client rows
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nom_utilisateur: username } // trigger reads this
      }
    });

    if (authError) return res.status(400).json({ error: authError.message });

    const user = data.user;
    if (!user) return res.status(400).json({ error: "Signup failed, no user returned" });

    // 2. If vendeur, upgrade via the DB function (inserts vendeur row + sets role)
    if (role === "vendeur") {
      const { error: upgradeError } = await supabase.rpc("upgrade_to_vendeur", {
        user_id: user.id
      });
      if (upgradeError) return res.status(400).json({ error: upgradeError.message });
    }

    // 3. If admin, insert admin row + update role
    if (role === "admin") {
      const { error: adminError } = await supabase
        .from("admin")
        .insert([{ id: user.id }]);
      if (adminError) return res.status(400).json({ error: adminError.message });

      await supabase
        .from("utilisateur")
        .update({ role: "admin" })
        .eq("id", user.id);
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
      email: user.email,
      role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    // Fetch role from utilisateur so frontend knows what to render
    const { data: profile, error: profileError } = await supabase
      .from("utilisateur")
      .select("role, nom_utilisateur")
      .eq("id", data.user.id)
      .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    res.status(200).json({
      message: "Signed in successfully",
      userId: data.user.id,
      email: data.user.email,
      role: profile.role,
      nomUtilisateur: profile.nom_utilisateur,
      session: data.session
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};