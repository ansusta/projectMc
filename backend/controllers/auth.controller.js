const supabase = require("../db");

exports.registerUser = async (req, res) => {
  console.log(' CONTROLLER REACHED! BODY:', req.body);
  
  try {
    const { email, password, username = 'default_user', role } = req.body;
    
    if (!email || !password) {
      console.log(' Missing email/password');
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    console.log(' CALLING auth.signUp...');
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log('auth.signUp RESULT:');
    console.log('- Has data:', !!data);
    console.log('- User exists:', !!(data?.user));
    console.log('- Error message:', authError?.message || 'None');
    console.log('- Error status:', authError?.statusCode || 'None');

    if (authError) {
      console.log('AUTH ERROR DETAILS:', authError.message);
      return res.status(400).json({ error: authError.message });
    }

    const user = data.user;
    if (!user) {
      console.log(' NO USER AFTER SIGNUP');
      return res.status(400).json({ error: "User object is null" });
    }

    console.log(' USER CREATED:', user.id);

    console.log(' Inserting utilisateur...');
    const { error: utilisateurError } = await supabase
      .from("utilisateur")
      .insert([{ id: user.id, nom_utilisateur: username, role }]);

    if (utilisateurError) {
      console.log(' UTILISATEUR INSERT ERROR:', utilisateurError.message);
      return res.status(400).json({ error: utilisateurError.message });
    }

    if (role === "client") {
      console.log('Inserting client...');
      const { error: clientError } = await supabase
        .from("client")
        .insert([{ id: user.id, statut: "actif" }]);
      if (clientError) {
        console.log(' CLIENT INSERT ERROR:', clientError.message);
        return res.status(400).json({ error: clientError.message });
      }
      console.log('Client inserted');
    }

    if (role === "vendeur") {
      console.log(' Inserting vendeur...');
      const { error: vendeurError } = await supabase
        .from("vendeur")
        .insert([{ id: user.id }]);
      if (vendeurError) {
        console.log(' VENDEUR INSERT ERROR:', vendeurError.message);
        return res.status(400).json({ error: vendeurError.message });
      }
      console.log('Vendeur inserted');
    }

    console.log(' REGISTRATION COMPLETE!');
    res.status(201).json({ 
      message: "User registered successfully", 
      userId: user.id,
      email: user.email
    });
    
  } catch (err) {
    console.log(' FULL CATCH ERROR:', err.message);
    console.log(' ERROR STACK:', err.stack);
    res.status(500).json({ error: err.message });
  }
};
exports.signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log(" Attempting sign in:", email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(" Sign in error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log(" Sign in successful:", data.user.id);

    res.status(200).json({
      message: "User signed in successfully",
      userId: data.user.id,
      email: data.user.email,
      session: data.session, 
    });
  } catch (err) {
    console.error(" Sign in catch error:", err.message);
    res.status(500).json({ error: err.message });
  }
};