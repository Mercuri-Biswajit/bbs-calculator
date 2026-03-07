// src/components/ReportsHistory.jsx

import { useState, useEffect } from "react";
import { Card, CardHeader, Button, Badge } from "./ui.jsx";
import { downloadPDF } from "../utils/pdfReport.js";

const STORAGE_KEY = "bbs_saved_reports";

// FIX #8 — saveReport now returns a status object so callers can surface errors to the user
export function saveReport(reportData) {
  try {
    const reports = getSavedReports();
    const newReport = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...reportData,
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return { ok: true, report: newReport };
  } catch (error) {
    console.error("Error saving report:", error);
    // Distinguish quota exceeded from other errors
    const isQuota =
      error instanceof DOMException &&
      (error.code === 22 ||
        error.code === 1014 ||
        error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED");
    return { ok: false, quota: isQuota, error };
  }
}

export function getSavedReports() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function deleteReport(id) {
  try {
    const filtered = getSavedReports().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function clearAllReports() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export default function ReportsHistory({ onLoadReport, onClose }) {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => setReports(getSavedReports());
  const handleDelete = (id) => {
    if (confirm("Delete this report?")) {
      deleteReport(id);
      loadReports();
    }
  };
  const handleClearAll = () => {
    if (confirm("Delete ALL saved reports? This cannot be undone.")) {
      clearAllReports();
      loadReports();
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
            onClick={onClose}
            className="btn btn--secondary btn--sm"
            style={{
              color: "rgba(255,255,255,.85)",
              borderColor: "rgba(255,255,255,.3)",
              background: "rgba(255,255,255,.12)",
            }}
          >
            ← Back to Calculator
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
              📚 Saved Reports History
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
        {reports.length > 0 && (
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

        {reports.length === 0 && (
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
            <button onClick={onClose} className="btn btn--primary btn--lg">
              Go to Calculator
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

        {reports.length > 0 && filteredReports.length === 0 && (
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
