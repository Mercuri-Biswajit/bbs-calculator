// src/components/ReportsHistory.jsx
// FIX #7 — Replaced direct localStorage calls with window.storage persistent API.
// localStorage is not supported in the artifact environment and silently fails,
// causing every save to return { ok: false } and showing the "storage full" banner.

import { useState, useEffect } from "react";
import { Card, CardHeader, Button, Badge } from "./ui.jsx";
import { downloadPDF } from "../utils/pdfReport.js";

const STORAGE_KEY = "bbs_saved_reports";

// ─── Storage helpers using standard localStorage API ──────────────────────────

async function getSavedReports() {
  try {
    let result = null;
    if (window.storage && window.storage.get) {
      const res = await window.storage.get(STORAGE_KEY);
      result = res ? res.value : null;
    } else {
      result = localStorage.getItem(STORAGE_KEY);
    }
    return result ? JSON.parse(result) : [];
  } catch {
    return [];
  }
}

async function persistReports(reports) {
  try {
    const dataString = JSON.stringify(reports);
    if (window.storage && window.storage.set) {
      await window.storage.set(STORAGE_KEY, dataString);
    } else {
      localStorage.setItem(STORAGE_KEY, dataString);
    }
    return { ok: true };
  } catch (error) {
    console.error("Storage error:", error);
    return { ok: false, error };
  }
}

// Public API — mirrors the old synchronous API but now async
export async function saveReport(reportData) {
  try {
    const reports = await getSavedReports();
    const newReport = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...reportData,
    };
    reports.unshift(newReport);
    // Keep only the last 50 reports to avoid hitting storage limits
    const trimmed = reports.slice(0, 50);
    const result = await persistReports(trimmed);
    return result.ok
      ? { ok: true, report: newReport }
      : { ok: false, quota: false, error: result.error };
  } catch (error) {
    console.error("Error saving report:", error);
    return { ok: false, quota: false, error };
  }
}

export async function deleteReport(id) {
  try {
    const reports = await getSavedReports();
    const filtered = reports.filter((r) => r.id !== id);
    await persistReports(filtered);
    return true;
  } catch {
    return false;
  }
}

export async function clearAllReports() {
  try {
    if (window.storage && window.storage.delete) {
      await window.storage.delete(STORAGE_KEY);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    return true;
  } catch {
    return false;
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ReportsHistory({ onLoadReport, onNewProject }) {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const data = await getSavedReports();
    setReports(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this report?")) {
      await deleteReport(id);
      await loadReports();
    }
  };

  const handleClearAll = async () => {
    if (confirm("Delete ALL saved reports? This cannot be undone.")) {
      await clearAllReports();
      await loadReports();
    }
  };

  const handleDownload = (report) =>
    downloadPDF(report.details, report.byType, report.allRows, report.costs);

  const filteredReports = reports.filter((r) => {
    const s = searchTerm.toLowerCase();
    return (
      r.details?.projectName?.toLowerCase().includes(s) ||
      r.details?.clientName?.toLowerCase().includes(s) ||
      r.details?.location?.toLowerCase().includes(s) ||
      r.details?.date?.includes(s)
    );
  });

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div
      className="dashboard-page"
      style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 48 }}
    >
      {/* Banner */}
      <div
        className="history-banner page-pad"
        style={{ paddingTop: 24, paddingBottom: 24, marginBottom: 26 }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
          <button
            onClick={onNewProject}
            className="btn btn--primary btn--sm"
          >
            + Create New Project
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 3,
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.3px",
              }}
            >
              📚 Dashboard & Projects
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,.6)",
                fontFamily: "var(--font-mono)",
              }}
            >
              View, download, or load previous BBS reports
            </div>
          </div>
          {reports.length > 0 && (
            <button
              onClick={handleClearAll}
              className="btn btn--danger btn--sm"
              style={{
                background: "#dc2626",
                color: "#fff",
                borderColor: "transparent",
              }}
            >
              🗑 Clear All ({reports.length})
            </button>
          )}
        </div>
      </div>

      <div
        className="page-pad"
        style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 0 }}
      >
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-3)",
            }}
          >
            Loading reports…
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="search-input-wrap">
            <span className="search-input-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by project name, client, location, or date…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "var(--surface)",
              borderRadius: "var(--radius-lg)",
              border: "2px dashed var(--border)",
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 18 }}>📋</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: 8,
                fontFamily: "var(--font-display)",
              }}
            >
              No Saved Reports Yet
            </div>
            <div
              style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 24 }}
            >
              Generate your first BBS report and it will automatically be saved
              here.
            </div>
            <button onClick={onNewProject} className="btn btn--primary btn--lg">
              Start New Project
            </button>
          </div>
        )}

        {filteredReports.length > 0 && (
          <div className="reports-grid">
            {filteredReports.map((report) => {
              const totalWt =
                report.allRows?.reduce((s, r) => s + r.weight, 0) || 0;
              const totalCost =
                report.costs?.reduce((s, r) => s + r.cost, 0) || 0;
              const elemCount =
                report.byType?.filter((t) => t.rows?.length > 0).length || 0;

              return (
                <Card key={report.id} className="report-card">
                  <div
                    style={{
                      padding: "16px 18px",
                      borderBottom: "1px solid var(--border-2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 10,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--text)",
                            marginBottom: 3,
                            letterSpacing: "-0.2px",
                          }}
                        >
                          {report.details?.projectName || "Unnamed Project"}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text-3)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {formatDate(report.timestamp)}
                        </div>
                      </div>
                      <Badge label={`${elemCount} types`} color="blue" />
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text-2)",
                        marginBottom: 3,
                      }}
                    >
                      👤 {report.details?.clientName || "—"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-2)" }}>
                      📍 {report.details?.location || "—"}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "14px 18px",
                      background: "var(--surface-2)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 14,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--text-3)",
                            fontWeight: 700,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                          }}
                        >
                          Steel Weight
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "var(--primary)",
                            marginTop: 2,
                          }}
                        >
                          {totalWt.toFixed(1)} kg
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--text-3)",
                            fontWeight: 700,
                            letterSpacing: 0.8,
                            textTransform: "uppercase",
                          }}
                        >
                          Total Cost
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 800,
                            color: "var(--green)",
                            marginTop: 2,
                          }}
                        >
                          ₹{totalCost.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleDownload(report)}
                        className="btn btn--primary btn--sm"
                        style={{ flex: 1 }}
                      >
                        ⬇️ Download
                      </button>
                      <button
                        onClick={() => onLoadReport(report)}
                        className="btn btn--secondary btn--sm"
                        style={{ flex: 1 }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="btn btn--danger btn--sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && reports.length > 0 && filteredReports.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "var(--surface)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text)",
                marginBottom: 6,
              }}
            >
              No reports found
            </div>
            <div style={{ fontSize: 13, color: "var(--text-3)" }}>
              Try a different search term
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
