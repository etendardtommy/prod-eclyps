import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TeamPage from "./pages/TeamPage";
import RosterPage from "./pages/RosterPage";
import GalleryPage from "./pages/GalleryPage";
import EvaCaenPage from "./pages/EvaCaenPage";
import ContactPage from "./pages/ContactPage";
import SchedulePage from "./pages/SchedulePage";
import NotFoundPage from "./pages/NotFoundPage";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";

// Espace privé stats équipe
import { StatsAuthProvider, useStatsAuth } from "./contexts/StatsAuthContext";
import LoginPage from "./pages/stats/LoginPage";
import StatsPage from "./pages/stats/StatsPage";

/**
 * Détecte si on est sur le sous-domaine stats.eclyps-esport.fr.
 * En local (localhost), on peut forcer le mode stats via ?stats=1 dans l'URL.
 */
function isStatsDomain() {
  const host = window.location.hostname;
  return (
    host === "stats.eclyps-esport.fr" ||
    new URLSearchParams(window.location.search).get("stats") === "1"
  );
}

/**
 * App stats : affiche login ou dashboard selon l'état de connexion.
 * Le StatsAuthProvider gère la vérification du cookie au chargement.
 */
function StatsApp() {
  const { user, loading } = useStatsAuth();

  // Pendant la vérification initiale du cookie, on n'affiche rien
  // (évite un flash de la page login si le joueur est déjà connecté)
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#4b5563", fontSize: "0.9rem" }}>Chargement…</span>
      </div>
    );
  }

  return user ? <StatsPage /> : <LoginPage />;
}

function App() {
  // Si on est sur le sous-domaine stats → afficher l'espace équipe
  if (isStatsDomain()) {
    return (
      <StatsAuthProvider>
        <StatsApp />
      </StatsAuthProvider>
    );
  }

  // Sinon → site public ECLYPS normal
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="team" element={<TeamPage />} />
            <Route path="roster" element={<RosterPage />} />
            <Route path="galerie" element={<GalleryPage />} />
            <Route path="eva-caen" element={<EvaCaenPage />} />
            <Route path="calendrier" element={<SchedulePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="mentions-legales" element={<MentionsLegales />} />
            <Route path="politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
