import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package, AlertTriangle, Sparkles, LineChart, Barcode, Plus, 
  ShoppingCart, Wallet, Boxes, BarChart2, PlusSquare,
  QrCode, ReceiptText, Banknote, LinkIcon, Users, CreditCard, Settings, Zap
} from "lucide-react";

import TopBar from "../components/TopBar";
import "../styles/InventoryDashboard.css";
import { ResponsiveContainer, LineChart as ReLineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

export default function InventoryDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState("Owner (Full Access)");

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

  // Auto-route generator
  const makeRoute = (label: string) =>
    "/" +
    label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-").replace(/-/g, "-");

  // Demo Data
  const salesTrend = [
    { day: "Mon", value: 50 },
    { day: "Tue", value: 55 },
    { day: "Wed", value: 60 },
    { day: "Thu", value: 48 },
    { day: "Fri", value: 75 },
    { day: "Sat", value: 90 },
    { day: "Sun", value: 65 }
  ];

  const categoryData = [
    { name: "Electronics", value: 45 },
    { name: "Clothing", value: 30 },
    { name: "Food", value: 22 },
    { name: "Books", value: 12 }
  ];

  const recentTransactions = [
    { id: 1, name: "Wireless Headphones", time: "2 hours ago", amount: "+$259.98" },
    { id: 2, name: "Coffee Maker", time: "3 hours ago", amount: "+$89.99" },
    { id: 3, name: "Smart Watch", time: "5 hours ago", amount: "+$299.99" },
  ];

  const connectedApps = [
    { id: 1, name: "Shopify", time: "Synced 2 min ago", status: "Active", color: "#96C34A" },
    { id: 2, name: "QuickBooks", time: "Synced 15 min ago", status: "Active", color: "#5CB85C" },
    { id: 3, name: "Stripe", time: "Not connected", status: "Disconnected", color: "#5469D4" },
  ];

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
                className={`nav-item ${idx === 1 ? "active" : ""}`}
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

      {/* HEADER */}
      <div className="inv-header">
        <div>
          <h2>Welcome to Nayance</h2>
          <p>Manage your inventory and business operations</p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="inv-action-row">
        <button className="gold-btn"><ShoppingCart size={18}/> Record Sale</button>
        <Link to="/qr-&-barcodes" className="dark-btn" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Barcode size={18}/> Scan Code
        </Link>
        <Link to="/add-product" className="dark-btn" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Plus size={18}/> Add Product
        </Link>
        <Link to="/finance-overview" className="dark-btn" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <LineChart size={18}/> View Reports
        </Link>
      </div>

      {/* SUMMARY CARDS */}
      <div className="inv-summary-grid">
        
        <div className="inv-card">
          <div className="inv-card-top">
            <h4>Total Products</h4>
            <Package size={18}/>
          </div>
          <div className="inv-card-value">124</div>
          <div className="inv-card-change positive">+12% from last month</div>
        </div>

        <div className="inv-card">
          <div className="inv-card-top">
            <h4>Items Low Stock</h4>
            <AlertTriangle size={18} color="#d4af37"/>
          </div>
          <div className="inv-card-value red">23</div>
          <div className="inv-card-change red">Requires attention</div>
        </div>

        <div className="inv-card">
          <div className="inv-card-top">
            <h4>AI Insights</h4>
            <Sparkles size={18}/>
          </div>
          <div className="inv-card-value">8 New</div>
          <div className="inv-card-change link">View recommendations</div>
        </div>

        <div className="inv-card">
          <div className="inv-card-top">
            <h4>Weekly Sales</h4>
            <LineChart size={18}/>
          </div>
          <div className="inv-card-value">$12,435</div>
          <div className="inv-card-change positive">+18% from last week</div>
        </div>

      </div>

      {/* SALES TRENDS */}
      <div className="inv-charts-container">
        
        <div className="inv-chart-large">
          <h3>Sales Trends</h3>

          <ResponsiveContainer width="100%" height={250}>
            <ReLineChart data={salesTrend}>
              <CartesianGrid stroke="#222"/>
              <XAxis dataKey="day" stroke="#aaa"/>
              <YAxis stroke="#aaa"/>
              <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #333"}}/>
              <Line type="monotone" dataKey="value" stroke="#d4af37" strokeWidth={2}/>
            </ReLineChart>
          </ResponsiveContainer>

        </div>

        <div className="inv-chart-small">
          <h3>Inventory by Category</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid stroke="#222"/>
              <XAxis dataKey="name" stroke="#aaa"/>
              <YAxis stroke="#aaa"/>
              <Bar dataKey="value" fill="#d4af37" />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* RECENT TRANSACTIONS & CONNECTED APPS */}
      <div className="inv-bottom-section">
        
        {/* Recent Transactions */}
        <div className="inv-recent-transactions">
          <div className="inv-section-header">
            <h3>Recent Transactions</h3>
            <a href="#" className="view-all-link">View All →</a>
          </div>

          <div className="inv-transactions-list">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="inv-transaction-item">
                <div className="transaction-icon">
                  <ShoppingCart size={20} />
                </div>
                <div className="transaction-info">
                  <div className="transaction-name">{transaction.name}</div>
                  <div className="transaction-time">{transaction.time}</div>
                </div>
                <div className="transaction-amount">{transaction.amount}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Apps */}
        <div className="inv-connected-apps">
          <div className="inv-section-header">
            <h3>Connected Apps</h3>
            <a href="#" className="manage-link">Manage →</a>
          </div>

          <div className="inv-apps-list">
            {connectedApps.map((app) => (
              <div key={app.id} className="inv-app-item">
                <div className="app-icon" style={{ background: app.color + "20" }}>
                  <div style={{ width: 20, height: 20, background: app.color, borderRadius: 4 }}></div>
                </div>
                <div className="app-info">
                  <div className="app-name">{app.name}</div>
                  <div className="app-time">{app.time}</div>
                </div>
                <div className={`app-status ${app.status.toLowerCase().replace(" ", "-")}`}>
                  {app.status === "Active" ? (
                    <span className="status-active">● {app.status}</span>
                  ) : (
                    <span className="status-disconnected">{app.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
        </div>

      </main>
    </div>
  );
}
