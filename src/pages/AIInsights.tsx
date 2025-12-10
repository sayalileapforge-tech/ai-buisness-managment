import { useState } from "react";
import { Link } from "react-router-dom";
import {
  QrCode, Wallet, Boxes, ShoppingCart, BarChart2, PlusSquare,
  ReceiptText, Banknote, LinkIcon, Users, CreditCard, Settings,
  TrendingUp, BarChart3, Lightbulb, Sparkles, Zap
} from "lucide-react";
import TopBar from "../components/TopBar";
import "../styles/AIInsights.css";

type Insight = {
  id: string;
  title: string;
  level: "High" | "Medium" | "Low";
  levelColor: string;
  description: string;
  confidence: number; // 0-100
  details: string;
  icon?: string;
};

const INSIGHTS: Insight[] = [
  {
    id: "ins-1",
    title: "Restock Recommendation",
    level: "High",
    levelColor: "#ef4444",
    description:
      "Smart Watch stock is critically low. Based on recent sales velocity (3 sold today), you should reorder 25 units within the next 3 days.",
    confidence: 94,
    details:
      "Smart Watch has sold 18 units in the last 7 days (avg 2.57/day). Current stock is 5. We recommend an immediate reorder of 25 units to avoid stockout. Supplier lead time: 5 days. Estimated reorder cost: $3,750.",
    icon: "📦",
  },
  {
    id: "ins-2",
    title: "Sales Trend Alert",
    level: "Medium",
    levelColor: "#f59e0b",
    description:
      "Wireless Headphones showing 45% increase in sales this week. Last sale: 2 hours ago. Consider increasing stock for next month.",
    confidence: 87,
    details:
      "Sales last 14 days show an upward trend. Consider increasing safety stock by 20% and running a small targeted ad campaign to capitalise on momentum.",
    icon: "📈",
  },
  {
    id: "ins-3",
    title: "Revenue Optimization",
    level: "Low",
    levelColor: "#60a5fa",
    description:
      "Your average transaction value is $159. Bundle Coffee Maker with related products to increase to $210 per sale.",
    confidence: 78,
    details:
      "Create a bundle offer: Coffee Maker + Premium Beans + Filter at a bundled price. Estimated increase in conversion rate: 4% - 7%. Expected revenue uplift: ~12% per sale when bundled.",
    icon: "💡",
  },
  {
    id: "ins-4",
    title: "Slow-Moving Stock",
    level: "Medium",
    levelColor: "#f59e0b",
    description:
      "Desk Lamp: 45 days in inventory, only 2 sales recorded. Consider promotional pricing or bundle deals.",
    confidence: 72,
    details:
      "Desk Lamp has a turnover ratio of 0.044 per day. Consider clearance offers, cross-sell placement or bundling with accessories to improve movement.",
    icon: "⚠️",
  },
  {
    id: "ins-5",
    title: "Sales Forecast",
    level: "High",
    levelColor: "#ef4444",
    description:
      "Based on current sales patterns, you're projected to reach $15,200 revenue this month (18% above target).",
    confidence: 89,
    details:
      "Current sales velocity suggests you'll exceed your monthly target by 18%. Maintaining this trend requires consistent stock availability. Monitor peak hours (2-4 PM) for promotional opportunities.",
    icon: "📊",
  },
  {
    id: "ins-6",
    title: "Peak Sales Hours",
    level: "Low",
    levelColor: "#60a5fa",
    description:
      "Most sales occur between 2-4 PM. Consider running flash promotions during 10-12 AM to boost off-peak revenue.",
    confidence: 85,
    details:
      "Revenue distribution analysis shows 65% of daily sales concentrated between 2-4 PM. Running targeted flash sales during 10-12 AM could increase off-peak revenue by an estimated 15-20%.",
    icon: "🕐",
  },
];

export default function AIInsights() {
  const [selected, setSelected] = useState<Insight | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: Wallet, label: "Finance Overview" },
    { icon: Boxes, label: "Inventory Dashboard" },
    { icon: ShoppingCart, label: "Record Sale" },
    { icon: BarChart2, label: "Inventory Manager" },
    { icon: PlusSquare, label: "Add Product" },
    { icon: QrCode, label: "QR & Barcodes" },
    { icon: Sparkles, label: "AI Insights" },
    { icon: ReceiptText, label: "Financial Reports" },
    { icon: Banknote, label: "Tax Center" },
    { icon: LinkIcon, label: "Integrations" },
    { icon: Users, label: "Team Management" },
    { icon: CreditCard, label: "Billing & Plan" },
    { icon: Zap, label: "Improvement Hub" },
    { icon: Settings, label: "Settings" },
  ];

  const makeRoute = (label: string) =>
    "/" +
    label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-").replace(/-/g, "-");

  return (
    <div className="dashboard-wrapper">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h1 className="logo-text">AIPM</h1>
        </div>

        <nav className="nav-menu">
          {menuItems.map((item, idx) => {
            const IconComponent = item.icon;
            const isActive = idx === 6;

            return (
              <Link
                key={idx}
                to={makeRoute(item.label)}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <IconComponent size={18} className="nav-icon" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="location-main">Toronto, Ontario</div>
          <div className="location-sub">Top tables under restaurants</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">

        {/* Top Bar */}
        <TopBar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="scrollable-content">
          <div className="ai-page">
      <div className="ai-header">
        <div>
          <h2>AI Insights</h2>
          <p className="ai-sub">Smart recommendations powered by AI analysis</p>
        </div>

        <div className="ai-badge">
          <Sparkles size={14} color="#d4af37" />
          <span>6 New</span>
        </div>
      </div>

      {/* AI ANALYSIS ACTIVE */}
      <div className="ai-active-card">
        <div className="ai-active-left">
          <div className="ai-active-icon">✨</div>
          <div>
            <div className="ai-active-title">AI Analysis Active</div>
            <div className="ai-active-desc">
              Your inventory is being monitored 24/7 for optimization opportunities
            </div>
          </div>
        </div>
        <div className="ai-active-right">
          <div className="progress-wrap">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "94%" }} />
            </div>
            <div className="progress-value">94%</div>
          </div>
        </div>
      </div>

      {/* INSIGHT CARDS */}
      <div className="insights-list">
        {INSIGHTS.map((ins) => (
          <div className="insight-card" key={ins.id}>
            <div className="insight-top">
              <div className="insight-icon">{ins.icon}</div>
              <div className="insight-title">{ins.title}</div>
              <div
                className="insight-pill"
                style={{ background: `${ins.levelColor}22`, color: ins.levelColor }}
              >
                {ins.level}
              </div>
            </div>

            <div className="insight-body">
              <p>{ins.description}</p>
            </div>

            <div className="insight-footer">
              <div className="insight-meta">
                <span className="meta-dot" />
                <span className="meta-text">Confidence: {ins.confidence}%</span>
                <span className="meta-sep">•</span>
                <span className="meta-text">High sales velocity item</span>
              </div>

              <button
                className="view-details"
                onClick={() => setSelected(ins)}
              >
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* STATS CARDS */}
      <div className="ai-stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon optimization">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="stat-card-label">Optimization Score</div>
          <div className="stat-card-value">87/100</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon predictions">
              <BarChart3 size={24} />
            </div>
          </div>
          <div className="stat-card-label">Predictions Made</div>
          <div className="stat-card-value">1,247</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon actions">
              <Lightbulb size={24} />
            </div>
          </div>
          <div className="stat-card-label">Actions Taken</div>
          <div className="stat-card-value">342</div>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {selected && (
        <div
          className="insight-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <div
            className="insight-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h3>{selected.title}</h3>
              <div
                className="modal-badge"
                style={{ background: `${selected.levelColor}22`, color: selected.levelColor }}
              >
                {selected.level}
              </div>
            </div>

            <div className="modal-body">
              <p className="modal-desc">{selected.details}</p>

              <div className="modal-stats">
                <div>
                  <div className="stat-label">Confidence</div>
                  <div className="stat-value">{selected.confidence}%</div>
                </div>

                <div>
                  <div className="stat-label">Recommended action</div>
                  <div className="stat-value">Reorder / Promote / Bundle</div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelected(null)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => {
                // placeholder action — you can hook this to reorder flow
                alert("Open reorder workflow (not implemented)");
              }}>
                Take Action
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </main>
    </div>
  );
}
