import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wallet, Boxes, ShoppingCart, BarChart2, PlusSquare,
  QrCode, Sparkles, ReceiptText, Banknote, Link as LinkIcon,
  Users, CreditCard, Settings, Zap, CheckCircle, Check
} from "lucide-react";
import TopBar from "../components/TopBar";
import "../styles/Dashboard.css";
import "../styles/Integrations.css";

const syncHistory = [
  { app: "Shopify", action: "Products synced - 45 items", status: "Success", time: "2 min ago" },
  { app: "QuickBooks", action: "Financial data updated - 12 items", status: "Success", time: "15 min ago" },
  { app: "Shopify", action: "Orders imported - 8 items", status: "Success", time: "1 hour ago" },
  { app: "QuickBooks", action: "Invoices imported - 3 items", status: "Success", time: "2 hours ago" },
];

const integrationsList = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Sync products, orders, and inventory with your Shopify store",
    icon: ShoppingCart,
    connected: true,
    lastSync: "2 minutes ago",
    category: "Connected",
    features: ["Product Sync", "Inventory Updates", "Order Import", "Customer Data"],
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Auto-sync financial data, invoices, and expenses",
    icon: ReceiptText,
    connected: true,
    lastSync: "15 minutes ago",
    category: "Accounting",
    features: ["Financial Statements", "Expense Tracking", "Invoice Export", "Tax Reports"],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Process payments and sync transaction data automatically",
    icon: CreditCard,
    connected: false,
    category: "Payments",
    features: [],
  },
  {
    id: "square",
    name: "Square",
    description: "Integrate POS sales and payment processing",
    icon: Banknote,
    connected: false,
    category: "Payments",
    features: [],
  },
];

const Integrations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const sidebarNavRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (sidebarNavRef.current) {
      const activeItem = sidebarNavRef.current.querySelector(".nav-item.active");
      if (activeItem) {
        activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, []);

  const makeRoute = (label: string) =>
    "/" +
    label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-").replace(/-/g, "-");

  const getFilteredIntegrations = () => {
    switch (activeTab) {
      case "connected":
        return integrationsList.filter(app => app.connected);
      case "ecommerce":
        return integrationsList.filter(app => app.category === "Connected");
      case "accounting":
        return integrationsList.filter(app => app.category === "Accounting");
      case "payments":
        return integrationsList.filter(app => app.category === "Payments");
      default:
        return integrationsList;
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo-icon">N</div>
          {sidebarOpen && <span className="company-name">Golden Goods Inc.</span>}
        </div>

        <nav className="sidebar-nav" ref={sidebarNavRef}>
          {menuItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={idx}
                to={makeRoute(item.label)}
                className={`nav-item ${item.label === "Integrations" ? "active" : ""}`}
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
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div className="scrollable-content">
          <div className="integrations-container">
            {/* Header */}
            <div className="integrations-header">
              <h1>Integrations</h1>
              <p>Connect Nayance with your favorite business tools</p>
            </div>

            {/* Connected Apps Stats */}
            <div className="connected-stats">
              <div className="stat-card">
                <div className="stat-label">Connected Apps</div>
                <div className="stat-value">2 of 6</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Auto-Sync</div>
                <div className="stat-toggle">
                  <input 
                    type="checkbox" 
                    id="auto-sync-toggle"
                    checked={autoSyncEnabled}
                    onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                  />
                  <label htmlFor="auto-sync-toggle"></label>
                  <span>{autoSyncEnabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Last Sync</div>
                <div className="stat-value">2 minutes ago</div>
              </div>
            </div>

            {/* AI-Powered Sync Engine */}
            <div className="sync-engine-info">
              <div className="engine-icon">⚙️</div>
              <div className="engine-content">
                <h3>AI-Powered Sync Engine Active</h3>
                <p>Nayance's AI continuously monitors your connected apps and intelligently syncs data to prevent duplicates, resolve conflicts, and ensure accuracy across all platforms.</p>
                <div className="engine-tags">
                  <span className="tag">Real-time Sync</span>
                  <span className="tag">Conflict Resolution</span>
                  <span className="tag">Smart Mapping</span>
                </div>
              </div>
            </div>

            {/* Integration Categories Tabs */}
            <div className="integration-tabs">
              <button 
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Apps
              </button>
              <button 
                className={`tab-btn ${activeTab === 'connected' ? 'active' : ''}`}
                onClick={() => setActiveTab('connected')}
              >
                Connected
              </button>
              <button 
                className={`tab-btn ${activeTab === 'ecommerce' ? 'active' : ''}`}
                onClick={() => setActiveTab('ecommerce')}
              >
                E-commerce
              </button>
              <button 
                className={`tab-btn ${activeTab === 'accounting' ? 'active' : ''}`}
                onClick={() => setActiveTab('accounting')}
              >
                Accounting
              </button>
              <button 
                className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                Payments
              </button>
            </div>

            {/* Integration Cards */}
            <div className="integration-cards-grid">
              {getFilteredIntegrations().map((integration) => {
                const IconComponent = integration.icon;
                return (
                  <div key={integration.id} className={`integration-card ${integration.connected ? 'connected' : ''}`}>
                    <div className="card-icon">
                      <IconComponent size={32} />
                    </div>
                    <div className="card-header">
                      <h3>{integration.name}</h3>
                      {integration.connected && <span className="connected-badge">Connected</span>}
                    </div>
                    <p className="card-description">{integration.description}</p>
                    {integration.connected && (
                      <div className="card-sync-info">
                        Last sync: {integration.lastSync}
                      </div>
                    )}
                    {integration.features && integration.features.length > 0 && (
                      <div className="card-features">
                        <div className="card-features-label">Features:</div>
                        <ul>
                          {integration.features.map((feature, idx) => (
                            <li key={idx}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button className={`card-btn ${integration.connected ? 'configure' : 'connect'}`}>
                      {integration.connected ? (
                        <>
                          <Check size={16} /> Configure
                        </>
                      ) : (
                        'Connect'
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Sync History Section */}
            <div className="sync-history-section">
              <div className="sync-history-header">
                <div>
                  <h1>Sync History</h1>
                  <p>Recent synchronization activity</p>
                </div>
              </div>

              <div className="sync-history-list">
                {syncHistory.map((item, idx) => (
                  <div key={idx} className="sync-history-item">
                    <div className="sync-item-icon">
                      <CheckCircle size={20} className="sync-success-icon" />
                    </div>
                    <div className="sync-item-content">
                      <h4>{item.app}</h4>
                      <p>{item.action}</p>
                    </div>
                    <div className="sync-item-status">
                      <span className="status-badge">{item.status}</span>
                      <span className="sync-time">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sync Preferences Section */}
            <div className="sync-preferences-section">
              <h2>Sync Preferences</h2>
              <p>Control how and when data is synchronized</p>

              <div className="preferences-item">
                <div className="preference-content">
                  <h4>Automatic Sync</h4>
                  <p>Sync data automatically in real-time</p>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" defaultChecked id="auto-sync" />
                  <label htmlFor="auto-sync"></label>
                </div>
              </div>

              <div className="preferences-item">
                <div className="preference-content">
                  <h4>Conflict Resolution</h4>
                  <p>Let AI resolve data conflicts automatically</p>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" defaultChecked id="conflict" />
                  <label htmlFor="conflict"></label>
                </div>
              </div>

              <div className="preferences-item">
                <div className="preference-content">
                  <h4>Sync Notifications</h4>
                  <p>Get notified when sync completes or fails</p>
                </div>
                <div className="toggle-switch">
                  <input type="checkbox" defaultChecked id="notifications" />
                  <label htmlFor="notifications"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Integrations;
