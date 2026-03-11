import React from "react";
import logo from "../assets/icons/My__Logo.png";

export default function Sidebar({ tabs, activeTab, setActiveTab, elementSets, totalNos }) {
    return (
        <aside className="sidebar">
            <div className="sidebar__logo-wrap">
                <img
                    src={logo}
                    alt="Urban Matrix"
                    className="sidebar__logo"
                    onClick={() => {
                        setActiveTab(tabs[0].id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    style={{ cursor: "pointer" }}
                />
            </div>

            <div className="sidebar__nav">
                <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`sidebar__nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                >
                    <span className="sidebar__nav-icon">📊</span>
                    <span className="sidebar__nav-label">Dashboard</span>
                </button>
                <button
                    onClick={() => setActiveTab("project_details")}
                    className={`sidebar__nav-item ${activeTab === "project_details" ? "active" : ""}`}
                >
                    <span className="sidebar__nav-icon">📋</span>
                    <span className="sidebar__nav-label">Project Details</span>
                </button>

                <div className="sidebar__nav-title" style={{ marginTop: 16 }}>Elements</div>

                {tabs.map((t) => {
                    const nos = elementSets[t.id].items.reduce(
                        (s, it) => s + (+it.count || 1),
                        0,
                    );
                    const isActive = activeTab === t.id;

                    return (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`sidebar__nav-item ${isActive ? "active" : ""}`}
                        >
                            <span className="sidebar__nav-icon">{t.icon}</span>
                            <span className="sidebar__nav-label">{t.label}</span>
                            {nos > 0 && (
                                <span className="sidebar__nav-badge">{nos}</span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="sidebar__footer">
                <div className="sidebar__total">
                    <span>Total Quantities</span>
                    <strong>{totalNos} nos</strong>
                </div>
            </div>
        </aside>
    );
}
