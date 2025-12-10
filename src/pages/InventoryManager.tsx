import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, MoreVertical, X,
  QrCode, Wallet, Boxes, ShoppingCart, BarChart2, PlusSquare,
  ReceiptText, Banknote, LinkIcon, Users, CreditCard, Settings, Package, Edit, Trash2, Zap, Sparkles
} from "lucide-react";
import TopBar from "../components/TopBar";
import { getProducts, Product } from "../utils/localProductStore";
import "../styles/InventoryManager.css";

export default function InventoryManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("All");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ open: boolean; productId: string; qrCode: string }>({
    open: false,
    productId: "",
    qrCode: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = getProducts();
    setProducts(allProducts);
  };

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
    "/" + label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-").replace(/-/g, "-");

  // Display product's QR code or generate new one
  const generateQR = (product: Product) => {
    // If product has a saved QR code, display it
    if (product.qrCode) {
      setQrModal({ open: true, productId: product.id, qrCode: product.qrCode });
      return;
    }

    // Otherwise generate a new QR code for the product
    const productData = {
      name: product.name,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      id: product.id,
      timestamp: product.createdAt
    };

    const qrString = JSON.stringify(productData);

    const canvas = document.createElement("canvas");
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Gold background
    context.fillStyle = "#d4af37";
    context.fillRect(0, 0, size, size);

    // Black border
    context.fillStyle = "#000";
    context.fillRect(0, 0, size, 20);
    context.fillRect(0, size - 20, size, 20);
    context.fillRect(0, 0, 20, size);
    context.fillRect(size - 20, 0, 20, size);

    // QR pattern area (black)
    context.fillStyle = "#000";
    context.fillRect(20, 20, size - 40, size - 80);

    // Gold squares pattern
    context.fillStyle = "#d4af37";
    for (let i = 0; i < Math.sqrt(qrString.length); i++) {
      for (let j = 0; j < Math.sqrt(qrString.length); j++) {
        const x = 30 + (i * (size - 100)) / Math.sqrt(qrString.length);
        const y = 30 + (j * (size - 100)) / Math.sqrt(qrString.length);
        const squareSize = ((size - 100) / Math.sqrt(qrString.length)) * 0.7;
        if ((i + j) % 2 === 0) {
          context.fillRect(x, y, squareSize, squareSize);
        }
      }
    }

    // Product info text
    context.fillStyle = "#000";
    context.font = "bold 11px Arial";
    context.textAlign = "center";
    context.fillText(`Product: ${product.name.substring(0, 20)}`, size / 2, size - 25);
    context.fillText(`$${product.price.toFixed(2)}`, size / 2, size - 10);

    const qrUrl = canvas.toDataURL();
    setQrModal({ open: true, productId: product.id, qrCode: qrUrl });
  };
  let filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterBy === "All" || 
                       (filterBy === "Low Stock" && p.stock < 10) ||
                       (filterBy === "Has QR" && true) ||
                       p.category === filterBy;
    return matchSearch && matchFilter;
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "red" };
    if (stock < 10) return { label: "Low Stock", color: "orange" };
    return { label: "In Stock", color: "green" };
  };

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
                className={`nav-item ${idx === 3 ? "active" : ""}`}
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
          {/* HEADER */}
          <div className="inventory-header">
            <div>
              <h2 className="page-title">Inventory Manager</h2>
              <p className="page-subtitle">Manage and track all your products</p>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="inventory-controls">
            <div className="search-box">
              <Search size={18} color="#888" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-buttons">
              {["All", "Low Stock", "Has QR"].map(filter => (
                <button
                  key={filter}
                  className={`filter-btn ${filterBy === filter ? "active" : ""}`}
                  onClick={() => setFilterBy(filter)}
                >
                  {filter === "Low Stock" && "⚠️"} {filter}
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCTS GRID */}
          {filtered.length === 0 ? (
            <div className="no-products">
              <Package size={48} color="#888" />
              <p>No products found</p>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map(product => {
                const status = getStockStatus(product.stock);
                return (
                  <div key={product.id} className="product-card">
                    {/* Image */}
                    <div className="product-image-container">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="product-image" />
                      ) : (
                        <div className="product-placeholder">
                          <Package size={40} color="#888" />
                        </div>
                      )}

                      {/* Stock Badge */}
                      <span className={`stock-badge ${status.color}`}>
                        {status.label}
                      </span>

                      {/* QR Icon */}
                      <button 
                        className="qr-icon-btn"
                        onClick={() => generateQR(product)}
                      >
                        <QrCode size={18} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-category">{product.category}</p>

                      {/* Price */}
                      <div className="product-price">
                        ${product.price.toFixed(2)}
                      </div>

                      {/* Stock */}
                      <div className="product-stock">
                        ⊗ {product.stock} in stock
                      </div>
                    </div>

                    {/* Menu */}
                    <div className="product-menu-container">
                      <button 
                        className="product-menu"
                        onClick={() => setMenuOpenId(menuOpenId === product.id ? null : product.id)}
                      >
                        <MoreVertical size={16} />
                      </button>

                      {menuOpenId === product.id && (
                        <div className="product-menu-dropdown">
                          <button className="menu-item edit-item">
                            <Edit size={14} /> Edit
                          </button>
                          <button className="menu-item delete-item">
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* QR CODE MODAL */}
      {qrModal.open && (
        <div className="qr-modal-overlay" onClick={() => setQrModal({ ...qrModal, open: false })}>
          <div className="qr-modal-content" onClick={e => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Product QR Code</h3>
              <button 
                className="qr-modal-close"
                onClick={() => setQrModal({ ...qrModal, open: false })}
              >
                <X size={24} />
              </button>
            </div>

            <div className="qr-modal-body">
              <img src={qrModal.qrCode} alt="QR Code" className="qr-code-image" />
              <p className="qr-code-id">{qrModal.productId}</p>
            </div>

            <div className="qr-modal-footer">
              <button className="qr-download-btn">
                Download QR Code
              </button>
              <button 
                className="qr-close-btn"
                onClick={() => setQrModal({ ...qrModal, open: false })}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
