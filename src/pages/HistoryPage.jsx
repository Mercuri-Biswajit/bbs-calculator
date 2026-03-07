// src/pages/HistoryPage.jsx
// ─── Saved Reports History view ───────────────────────────────────────────────

import ReportsHistory from "../components/ReportsHistory.jsx";

export default function HistoryPage({ onLoadReport, onClose }) {
  return <ReportsHistory onLoadReport={onLoadReport} onClose={onClose} />;
}
