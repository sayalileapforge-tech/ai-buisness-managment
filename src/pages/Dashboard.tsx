import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

import {
  Wallet, Boxes, ShoppingCart, BarChart2, PlusSquare,
  QrCode, Sparkles, ReceiptText, Banknote, Link as LinkIcon,
  Users, CreditCard, Settings, Zap
} from "lucide-react";

import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";
import { getIntegrations } from "../utils/integrationStore";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [_selectedRole, setSelectedRole] = useState("Owner (Full Access)");
  const { user } = useAuth();

  const revenueData = [
    { month: "Jan", revenue: 90000, expenses: 55000 },
    { month: "Feb", revenue: 92000, expenses: 58000 },
    { month: "Mar", revenue: 88000, expenses: 57000 },
    { month: "Apr", revenue: 100000, expenses: 60000 },
    { month: "May", revenue: 95000, expenses: 58000 },
    { month: "Jun", revenue: 120000, expenses: 65000 },
  ];

  const costData = [
    { name: "Operations", value: 35, color: "#facc15" },
    { name: "Salaries", value: 40, color: "#ffd700" },
    { name: "Marketing", value: 15, color: "#ffed4e" },
    { name: "Other", value: 10, color: "#888888" },
  ];

  const summaryCards = [
    { label: "Total Revenue", value: "$579,000", change: "+18.2% from last month", color: "gold" },
    { label: "Total Expenses", value: "$335,000", change: "+5.7% from last month", color: "red" },
    { label: "Net Profit (After Tax)", value: "$214,720", change: "+22.4% from last month", color: "green" },
    { label: "Tax Owed", value: "$29,280", change: "12% tax rate (Ontario)", color: "orange" },
  ];

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

  const upcoming = [
    { title: "Q3 Corporate Tax Filing", date: "Due Oct 15, 2025" },
  ];

  const cashFlowItems = [
    { title: "Strong positive cash flow", value: 42.1 },
  ];

  // Auto-route generator
  const makeRoute = (label: string) =>
    "/" +
    label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-").replace(/-/g, "-");

  return (
    <div className="dashboard-wrapper">

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo-icon">N</div>
          {sidebarOpen && <span className="company-name">Golden Goods Inc.</span>}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={idx}
                to={makeRoute(item.label)}
                className={`nav-item ${idx === 0 ? "active" : ""}`}
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
          onRoleChange={(role) => setSelectedRole(role)}
        />

        <div className="scrollable-content">
          {(() => {
            const connected = getIntegrations();
            
            if (connected.length === 0) {
              return (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '600px',
                  flexDirection: 'column',
                  textAlign: 'center'
                }}>
                  <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>
                    Connect Your Business Data
                  </h2>
                  <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>
                    Please connect at least one business source to see analytics and data.
                  </p>
                  <a href="/connect-business" style={{
                    background: 'linear-gradient(180deg, #d4af37, #b7871a)',
                    color: '#000',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    Go to Connect Business
                  </a>
                </div>
              );
            }

            return (
              <>
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h2 className="page-title">Financial Overview</h2>
              <p className="page-subtitle">Welcome back, {user?.displayName || user?.email?.split("@")[0] || "User"}</p>
            </div>

            <div className="system-status">
              <div className="status-dot"></div>
              <span className="status-text">All Systems Active</span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            {summaryCards.map((card, i) => (
              <div className={`summary-card card-${card.color}`} key={i}>
                <div className="card-top">
                  <div className="card-label">{card.label}</div>
                  <div className={`card-indicator card-${card.color}`}></div>
                </div>
                <div className="card-value">{card.value}</div>
                <div className="card-change">{card.change}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="charts-grid">
            <div className="chart-box">
              <h3 className="chart-title">Revenue vs Expenses</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#aaaaaa" />
                  <YAxis stroke="#aaaaaa" />
                  <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333" }} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#facc15" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" stroke="#ff6b6b" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h3 className="chart-title">Cost Distribution</h3>
              <div className="cost-chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={costData} dataKey="value" outerRadius={70} innerRadius={40}>
                      {costData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="cost-legend">
                  {costData.map((item, i) => (
                    <div key={i} className="legend-item">
                      <span className="legend-dot" style={{ background: item.color }}></span>
                      <span className="legend-name">{item.name}</span>
                      <span className="legend-value">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bottom-section">

            <div className="mini-card">
              <div className="mini-header">
                <h3>Upcoming Tax Deadlines</h3>
              </div>
              {upcoming.map((item, i) => (
                <div className="mini-row" key={i}>
                  <div>
                    <div className="mini-title">{item.title}</div>
                    <div className="mini-date">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mini-card">
              <div className="mini-header">
                <h3>Cash Flow Health</h3>
              </div>
              {cashFlowItems.map((item, i) => (
                <div key={i}>
                  <div className="mini-title">{item.title}</div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.value}%` }}></div>
                  </div>
                  <div className="progress-text">{item.value}%</div>
                </div>
              ))}
            </div>

            <div className="mini-card">
              <div className="mini-header">
                <h3>AI Insights</h3>
              </div>
              <p className="insights-text">
                Your revenue is projected to increase next quarter based on current trends.
              </p>
              <button className="insights-btn">View Breakdown</button>
            </div>

          </div>
              </>
            );
          })()}
        </div>

      </main>
    </div>
  );
}
