/**
 * StatsAuthContext — Gestion de la connexion pour l'espace stats équipe.
 *
 * Ce contexte fonctionne comme un "gardien" :
 * - Il vérifie si tu es connecté au chargement de la page
 * - Il expose les fonctions login() et logout()
 * - Les pages protégées l'utilisent pour savoir si l'accès est autorisé
 */
import { createContext, useContext, useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL;

const StatsAuthContext = createContext(null);

export function StatsAuthProvider({ children }) {
  const [user, setUser] = useState(null);       // null = pas connecté, objet = connecté
  const [loading, setLoading] = useState(true); // true pendant la vérif initiale

  // Au chargement : vérifie si un cookie valide existe déjà
  useEffect(() => {
    fetch(`${API}/eclyps/auth/me`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const res = await fetch(`${API}/eclyps/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "Identifiants incorrects");
    }
    // Recharge les infos du joueur connecté
    const me = await fetch(`${API}/eclyps/auth/me`, { credentials: "include" }).then((r) => r.json());
    setUser(me);
    return me;
  }

  async function logout() {
    await fetch(`${API}/eclyps/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
  }

  return (
    <StatsAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </StatsAuthContext.Provider>
  );
}

// Hook pratique : const { user, login, logout } = useStatsAuth();
export function useStatsAuth() {
  return useContext(StatsAuthContext);
}
