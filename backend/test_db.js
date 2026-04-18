const supabase = require("./db");

async function testUpdate() {
  const testId = process.argv[2];
  if (!testId) {
    console.log("Please provide an order ID");
    return;
  }
  
  console.log(`Testing update for order ${testId} to 'acceptee'...`);
  const { data, error } = await supabase
    .from("commande")
    .update({ statut_commande: "acceptee" })
    .eq("id", testId)
    .select()
    .single();

  if (error) {
    console.error("UPDATE ERROR:", error);
  } else {
    console.log("UPDATE SUCCESS:", data);
  }
  process.exit();
}

testUpdate();
