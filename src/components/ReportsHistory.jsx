// src/components/ReportsHistory.jsx
// Manages saved BBS reports with view, download, and delete functionality

import { useState, useEffect } from "react";
import { Card, CardHeader, Button, Badge } from "./ui.jsx";
import { downloadPDF } from "../utils/pdfReport.js";

// Storage key for reports
const STORAGE_KEY = "bbs_saved_reports";

// Helper functions for localStorage
export function saveReport(reportData) {
  try {
    const reports = getSavedReports();
    const newReport = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...reportData,
    };
    reports.unshift(newReport); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    return newReport;
  } catch (error) {
    console.error("Error saving report:", error);
    return null;
  }
}

export function getSavedReports() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading reports:", error);
    return [];
  }
}

export function deleteReport(id) {
  try {
    const reports = getSavedReports();
    const filtered = reports.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error("Error deleting report:", error);
    return false;
  }
}

export function clearAllReports() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing reports:", error);
    return false;
  }
}

// ─── REPORTS HISTORY COMPONENT ───────────────────────────────────────────────
export default function ReportsHistory({ onLoadReport, onClose }) {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setReports(getSavedReports());
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this report?")) {
      deleteReport(id);
      loadReports();
      if (selectedReport?.id === id) setSelectedReport(null);
    }
  };

  const handleClearAll = () => {
    if (
      confirm(
        "Are you sure you want to delete ALL saved reports? This cannot be undone.",
      )
    ) {
      clearAllReports();
      loadReports();
      setSelectedReport(null);
    }
  };

  const handleDownload = (report) => {
    downloadPDF(report.details, report.byType, report.allRows, report.costs);
  };

  const filteredReports = reports.filter((r) => {
    const search = searchTerm.toLowerCase();
    return (
      r.details?.projectName?.toLowerCase().includes(search) ||
      r.details?.clientName?.toLowerCase().includes(search) ||
      r.details?.location?.toLowerCase().includes(search) ||
      r.details?.date?.includes(search)
    );
  });

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: 40 }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg,#1565c0,#0d47a1)",
          padding: "22px 32px",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,.15)",
              border: "1px solid rgba(255,255,255,.3)",
              color: "#fff",
              borderRadius: 6,
              padding: "7px 16px",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            ← Back to Calculator
          </button>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              📚 Saved Reports History
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)" }}>
              View, download, or load previous BBS reports
            </div>
          </div>
          {reports.length > 0 && (
            <button
              onClick={handleClearAll}
              style={{
                background: "#c0392b",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 18px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🗑 Clear All ({reports.length})
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
        {/* Search bar */}
        {reports.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="🔍 Search by project name, client, location, or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 18px",
                fontSize: 14,
                border: "1.5px solid var(--border)",
                borderRadius: 8,
                background: "white",
              }}
            />
          </div>
        )}

        {/* Empty state */}
        {reports.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "white",
              borderRadius: 10,
              border: "2px dashed var(--border)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: 8,
              }}
            >
              No Saved Reports Yet
            </div>
            <div
              style={{ fontSize: 14, color: "var(--text3)", marginBottom: 20 }}
            >
              Generate your first BBS report and it will automatically be saved
              here for future reference.
            </div>
            <button
              onClick={onClose}
              style={{
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Go to Calculator
            </button>
          </div>
        )}

        {/* Reports list */}
        {filteredReports.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 16,
            }}
          >
            {filteredReports.map((report) => {
              const totalWt =
                report.allRows?.reduce((s, r) => s + r.weight, 0) || 0;
              const totalCost =
                report.costs?.reduce((s, r) => s + r.cost, 0) || 0;
              const elementCount =
                report.byType?.filter((t) => t.rows?.length > 0).length || 0;

              return (
                <Card
                  key={report.id}
                  style={{ cursor: "pointer", transition: "all .2s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(0,0,0,.12)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "var(--shadow-sm)")
                  }
                >
                  <div
                    style={{
                      padding: "14px 16px",
                      borderBottom: "1px solid var(--border2)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 15,
                            fontWeight: 700,
                            color: "var(--text)",
                            marginBottom: 4,
                          }}
                        >
                          {report.details?.projectName || "Unnamed Project"}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "var(--text3)",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {formatDate(report.timestamp)}
                        </div>
                      </div>
                      <Badge label={`${elementCount} types`} color="blue" />
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--text2)",
                        marginBottom: 2,
                      }}
                    >
                      👤 {report.details?.clientName || "—"}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>
                      📍 {report.details?.location || "—"}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "12px 16px",
                      background: "var(--surface2)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--text3)",
                            fontWeight: 600,
                          }}
                        >
                          STEEL WEIGHT
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "var(--primary)",
                          }}
                        >
                          {totalWt.toFixed(1)} kg
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--text3)",
                            fontWeight: 600,
                          }}
                        >
                          TOTAL COST
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: "var(--green)",
                          }}
                        >
                          ₹{totalCost.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleDownload(report)}
                        style={{
                          flex: 1,
                          background: "var(--primary)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "8px 12px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        ⬇️ Download
                      </button>
                      <button
                        onClick={() => onLoadReport(report)}
                        style={{
                          flex: 1,
                          background: "white",
                          color: "var(--primary)",
                          border: "1px solid var(--primary)",
                          borderRadius: 6,
                          padding: "8px 12px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDelete(report.id)}
                        style={{
                          background: "#fff0f0",
                          color: "#c0392b",
                          border: "1px solid #f5c6c6",
                          borderRadius: 6,
                          padding: "8px 12px",
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
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

        {/* No search results */}
        {reports.length > 0 && filteredReports.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "white",
              borderRadius: 10,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
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
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              Try a different search term
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
