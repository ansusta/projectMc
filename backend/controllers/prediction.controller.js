// controllers/prediction.controller.js
// Uses Node 22 native fetch — no axios, no extra dependencies
const supabase = require("../db");

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

// ─────────────────────────────────────────────────────────────
// HELPER — call the Python ML service with native fetch
// ─────────────────────────────────────────────────────────────
async function callML(path, body, timeoutMs = 30000) {
  let res;
  try {
    res = await fetch(`${ML_SERVICE_URL}${path}`, {
      method  : "POST",
      headers : { "Content-Type": "application/json" },
      body    : JSON.stringify(body),
      signal  : AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw Object.assign(new Error("ML service timeout"), { code: "ML_TIMEOUT" });
    }
    throw Object.assign(new Error("ML service indisponible"), { code: "ECONNREFUSED" });
  }

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `ML service returned ${res.status}`);
  }

  return res.json();
}


// ─────────────────────────────────────────────────────────────
// HELPER — fetch historical daily revenue for a shop
// ─────────────────────────────────────────────────────────────
async function getShopDailyRevenue(id_magasin, days = 400) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("ligne_commande")
    .select(`
      prix_at_time,
      qte,
      commande!ligne_commande_id_commande_fkey (
        date_commande,
        statut_commande
      ),
      produit!ligne_commande_id_produit_fkey (
        id_magasin
      )
    `)
    .eq("produit.id_magasin", id_magasin)
    .gte("commande.date_commande", since.toISOString())
    .eq("commande.statut_commande", "completer");

  if (error) throw new Error(error.message);

  const dailyMap = {};
  for (const row of data) {
    if (!row.commande || !row.produit) continue;
    const date = row.commande.date_commande.split("T")[0];
    dailyMap[date] = (dailyMap[date] || 0) + row.prix_at_time * row.qte;
  }

  const sortedDates = Object.keys(dailyMap).sort();
  if (sortedDates.length === 0) return [];

  const start   = new Date(sortedDates[0]);
  const end     = new Date(sortedDates[sortedDates.length - 1]);
  const result  = [];
  const current = new Date(start);

  while (current <= end) {
    const key = current.toISOString().split("T")[0];
    result.push(dailyMap[key] || 0);
    current.setDate(current.getDate() + 1);
  }

  return result;
}


// ─────────────────────────────────────────────────────────────
// HELPER — fetch per-product sales history for a shop
// ─────────────────────────────────────────────────────────────
async function getShopProductHistory(id_magasin, days = 60) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data: produits, error: prodErr } = await supabase
    .from("produit")
    .select("id, nom_produit, prix, qte_dispo")
    .eq("id_magasin", id_magasin);

  if (prodErr) throw new Error(prodErr.message);
  if (!produits.length) return [];

  const productIds = produits.map(p => p.id);

  const { data: ventes, error: ventErr } = await supabase
    .from("ligne_commande")
    .select(`
      id_produit,
      qte,
      commande!ligne_commande_id_commande_fkey (
        date_commande,
        statut_commande
      )
    `)
    .in("id_produit", productIds)
    .gte("commande.date_commande", since.toISOString())
    .eq("commande.statut_commande", "completer");

  if (ventErr) throw new Error(ventErr.message);

  const productMap = {};
  for (const p of produits) {
    productMap[p.id] = {
      nom_produit : p.nom_produit,
      avg_price   : parseFloat(p.prix),
      qte_dispo   : p.qte_dispo,
      dailySales  : {},
    };
  }

  for (const v of ventes) {
    if (!v.commande) continue;
    const date = v.commande.date_commande.split("T")[0];
    const pid  = v.id_produit;
    if (!productMap[pid]) continue;
    productMap[pid].dailySales[date] =
      (productMap[pid].dailySales[date] || 0) + v.qte;
  }

  const today  = new Date();
  const result = [];

  for (const info of Object.values(productMap)) {
    const arr = [];
    for (let i = days - 1; i >= 0; i--) {
      const d   = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      arr.push(info.dailySales[key] || 0);
    }
    result.push({
      nom_produit     : info.nom_produit,
      avg_price       : info.avg_price,
      qte_dispo       : info.qte_dispo,
      historical_units: arr,
    });
  }

  return result;
}


// ─────────────────────────────────────────────────────────────
// SHARED — verify shop ownership (seller or admin)
// ─────────────────────────────────────────────────────────────
async function verifyShopAccess(id_magasin, userId) {
  const { data: magasin, error } = await supabase
    .from("magasin")
    .select("id, id_vendeur")
    .eq("id", id_magasin)
    .single();

  if (error || !magasin) return { allowed: false, status: 404, msg: "Magasin introuvable" };
  if (magasin.id_vendeur === userId) return { allowed: true };

  const { data: isAdmin } = await supabase
    .from("admin").select("id").eq("id", userId).single();

  if (isAdmin) return { allowed: true };
  return { allowed: false, status: 403, msg: "Accès refusé" };
}


// ─────────────────────────────────────────────────────────────
// CONTROLLER — GET REVENUE FORECAST
// GET /api/prediction/revenue/:id_magasin
// ─────────────────────────────────────────────────────────────
exports.getRevenueForecast = async (req, res) => {
  try {
    const { id_magasin } = req.params;

    const access = await verifyShopAccess(id_magasin, req.user.id);
    if (!access.allowed)
      return res.status(access.status).json({ error: access.msg });

    const today = new Date().toISOString().split("T")[0];
    const { data: cached } = await supabase
      .from("prediction_revenu")
      .select("*")
      .eq("id_magasin", id_magasin)
      .gte("genere_le", `${today}T00:00:00Z`)
      .order("date_cible", { ascending: true });

    if (cached && cached.length >= 7)
      return res.status(200).json({ source: "cache", forecasts: cached });

    const historicalRevenue = await getShopDailyRevenue(id_magasin, 400);

    if (historicalRevenue.length < 30) {
      return res.status(200).json({
        forecasts : [],
        message   : "Données insuffisantes (moins de 30 jours de ventes complétées)",
      });
    }

    const { forecasts } = await callML(
      "/predict/revenue",
      { historical_revenue: historicalRevenue },
      30000
    );

    const rows = forecasts.map(f => ({
      id_magasin    : id_magasin,
      date_cible    : f.date,
      revenu_predit : f.revenu_predit,
      genere_le     : new Date().toISOString(),
    }));

    await supabase
      .from("prediction_revenu")
      .upsert(rows, { onConflict: "id_magasin,date_cible" });

    return res.status(200).json({ source: "model", forecasts });

  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ML_TIMEOUT") {
      return res.status(503).json({
        error: "Service ML indisponible — assurez-vous que ml_service.py tourne sur le port 5001",
      });
    }
    res.status(500).json({ error: err.message });
  }
};


// ─────────────────────────────────────────────────────────────
// CONTROLLER — GET RESTOCK ALERTS
// GET /api/prediction/restock/:id_magasin
// ─────────────────────────────────────────────────────────────
exports.getRestockAlerts = async (req, res) => {
  try {
    const { id_magasin } = req.params;

    const access = await verifyShopAccess(id_magasin, req.user.id);
    if (!access.allowed)
      return res.status(access.status).json({ error: access.msg });

    const today = new Date().toISOString().split("T")[0];
    const { data: cached } = await supabase
      .from("prediction_restock")
      .select("*")
      .eq("id_magasin", id_magasin)
      .gte("genere_le", `${today}T00:00:00Z`)
      .order("alerte_restock", { ascending: false });

    if (cached && cached.length > 0)
      return res.status(200).json({ source: "cache", alerts: cached });

    const products = await getShopProductHistory(id_magasin, 60);

    if (!products.length) {
      return res.status(200).json({
        alerts  : [],
        message : "Aucun produit trouvé pour ce magasin",
      });
    }

    const { alerts } = await callML(
      "/predict/restock",
      { products },
      60000
    );

    await supabase
      .from("prediction_restock")
      .delete()
      .eq("id_magasin", id_magasin)
      .gte("genere_le", `${today}T00:00:00Z`);

    const rows = alerts.map(a => ({
      id_magasin          : id_magasin,
      nom_produit         : a.nom_produit,
      unite_7j            : a.unite_7j    ?? 0,
      seuil_normal        : a.seuil_normal ?? 0,
      alerte_restock      : a.alerte_restock,
      jours_stock_restant : a.jours_stock_restant,
    }));

    await supabase.from("prediction_restock").insert(rows);

    return res.status(200).json({ source: "model", alerts });

  } catch (err) {
    if (err.code === "ECONNREFUSED" || err.code === "ML_TIMEOUT") {
      return res.status(503).json({
        error: "Service ML indisponible — assurez-vous que ml_service.py tourne sur le port 5001",
      });
    }
    res.status(500).json({ error: err.message });
  }
};