import { useState } from "react";
import { Link } from "react-router-dom";
import {
  QrCode, Wallet, Boxes, ShoppingCart, BarChart2, PlusSquare,
  ReceiptText, Banknote, LinkIcon, Users, CreditCard, Settings, TrendingUp, Zap, Sparkles
} from "lucide-react";
import TopBar from "../components/TopBar";
import "../styles/RecordSale.css";

export default function RecordSale() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState("Owner (Full Access)");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState(1);
  const [cartItems, setCartItems] = useState<Array<{name: string, price: number, quantity: number}>>([]);
  const [completedSales, setCompletedSales] = useState<Array<{id: string, date: string, product: string, quantity: number, total: number}>>([]);

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

  const products = [
    "Wireless Headphones - $129.99 (45 in stock)",
    "Smart Watch - $299.99 (8 in stock)",
    "Coffee Maker - $89.99 (23 in stock)",
    "Running Shoes - $149.99 (5 in stock)",
    "Desk Lamp - $45.99 (67 in stock)",
    "Backpack - $79.99 (34 in stock)",
    "Water Bottle - $24.99 (12 in stock)",
    "Bluetooth Speaker - $79.99 (3 in stock)",
  ];

  // Extract price from product string
  const getPrice = (productStr: string): number => {
    const match = productStr.match(/\$(\d+\.\d+)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Extract product name from product string
  const getProductName = (productStr: string): string => {
    return productStr.split(" - ")[0];
  };

  // Add product to cart
  const addToCart = () => {
    if (!selectedProduct || qty <= 0) return;
    
    const productName = getProductName(selectedProduct);
    const price = getPrice(selectedProduct);
    
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.name === productName 
          ? { ...item, quantity: item.quantity + qty }
          : item
      ));
    } else {
      setCartItems([...cartItems, { name: productName, price, quantity: qty }]);
    }
    
    setSelectedProduct("");
    setQty(1);
  };

  // Delete item from cart
  const deleteFromCart = (itemName: string) => {
    setCartItems(cartItems.filter(item => item.name !== itemName));
  };

  // Update item quantity
  const updateQuantity = (itemName: string, newQty: number) => {
    if (newQty <= 0) {
      deleteFromCart(itemName);
    } else {
      setCartItems(cartItems.map(item =>
        item.name === itemName 
          ? { ...item, quantity: newQty }
          : item
      ));
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.13; // 13% tax
  const total = subtotal + tax;

  // Complete sale - save to completed sales
  const completeSale = () => {
    if (cartItems.length === 0) return;
    
    const now = new Date();
    const dateStr = now.toLocaleString(); // e.g., "11/27/2025, 11:54 PM"
    
    // Add each item as separate completed sale entry
    const newSales = cartItems.map((item, idx) => ({
      id: `${now.getTime()}-${idx}`,
      date: dateStr,
      product: item.name,
      quantity: item.quantity,
      total: item.price * item.quantity + ((item.price * item.quantity) * 0.13)
    }));
    
    setCompletedSales([...newSales, ...completedSales]);
    setCartItems([]);
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
                className={`nav-item ${idx === 2 ? "active" : ""}`}
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

          <h2 className="page-title">Record Sale</h2>
          <p className="page-subtitle">
            Process sales and automatically update inventory & financials
          </p>

          <div className="record-sale-container">
            {/* LEFT COLUMN */}
            <div className="left-column">
              {/* QUICK SCAN BOX */}
              <div className="quickscan-box">
                <div className="q-left">
                  <div className="q-icon"><QrCode size={22} /></div>
                  <div>
                    <div className="q-title">Quick Scan</div>
                    <div className="q-desc">
                      Scan product QR code or barcode to add to cart
                    </div>
                  </div>
                </div>
                <button className="q-button">
                  <QrCode size={16} />
                  Open Scanner
                </button>
              </div>

              {/* ADD PRODUCT BOX */}
              <div className="add-box">
            <div className="add-header">Add Products to Sale</div>

            <div className="add-controls">
              <div className="add-left">
                <label>Select Product</label>
                <select
                  className="product-select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Choose a product</option>
                  {products.map((p, i) => (
                    <option key={i}>{p}</option>
                  ))}
                </select>
              </div>

              <div className="add-right">
                <label>Quantity</label>
                <div className="qty-box">
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  />
                  <button className="qty-plus" onClick={addToCart}>+</button>
                </div>
              </div>
            </div>

           
            </div>

              {/* CURRENT SALE BOX */}
              <div className="current-sale-box">
                <div className="current-sale-header">
                  <ShoppingCart size={18} />
                  Current Sale ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
                </div>

                <div className="current-sale-items">
                  {cartItems.length === 0 ? (
                    <>
                      <ShoppingCart size={32} className="cart-empty-icon" />
                      <div className="cart-empty-text">No items in cart</div>
                      <div className="cart-empty-subtext">Add products to start a sale</div>
                    </>
                  ) : (
                    <div className="cart-items-list">
                      {cartItems.map((item, idx) => (
                        <div key={idx} className="cart-item">
                          <div className="cart-item-header">
                            <div>
                              <div className="cart-item-name">{item.name}</div>
                              <div className="cart-item-price">${item.price.toFixed(2)} each</div>
                            </div>
                            <span className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <div className="cart-item-footer">
                            <div className="qty-controls">
                              <button 
                                className="qty-btn"
                                onClick={() => updateQuantity(item.name, item.quantity - 1)}
                              >
                                −
                              </button>
                              <span className="qty-display">{item.quantity}</span>
                              <button 
                                className="qty-btn"
                                onClick={() => updateQuantity(item.name, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button 
                              className="delete-btn"
                              onClick={() => deleteFromCart(item.name)}
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="right-column">
              {/* SALE SUMMARY BOX */}
              <div className="summary-box">
                <div className="summary-header">Sale Summary</div>

                <div className="summary-line">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-value">${subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-line">
                  <span className="summary-label">Tax (13%)</span>
                  <span className="summary-value">${tax.toFixed(2)}</span>
                </div>

                <div className="summary-line summary-total">
                  <span className="summary-label">Total</span>
                  <span className="summary-value">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* FINANCIAL IMPACT BOX */}
              <div className="impact-box">
                <div className="impact-title">Financial Impact</div>

                <div className="impact-line">
                  <span className="impact-label">Revenue</span>
                  <span className="impact-green">+${total.toFixed(2)}</span>
                </div>

                <div className="impact-line">
                  <span className="impact-label">Profit</span>
                  <span className="impact-green">+${(total * 0.30).toFixed(2)}</span>
                </div>

                <button className="complete-sale-btn" onClick={completeSale}>
                  <ShoppingCart size={16} />
                  Complete Sale
                </button>

                <div className="impact-footnote">
                  ✓ Inventory auto-updates<br />
                  ✓ Financials sync instantly
                </div>
              </div>

              {/* TODAY'S SALES BOX */}
              <div className="today-box">
                <div className="today-header">Today's Sales</div>

                <div className="today-item">
                  <div className="today-left">
                    <TrendingUp size={14} />
                    Total Revenue
                  </div>
                  <div className="today-right">$889.91</div>
                </div>

                <div className="today-item">
                  <div className="today-left">
                    <ShoppingCart size={14} />
                    Transactions
                  </div>
                  <div className="today-right">4 sales</div>
                </div>
              </div>
            </div>

            {/* RECENT SALES TABLE - FULL WIDTH AT BOTTOM */}
            <div className="recent-sales-box">
              <div className="recent-sales-header">Recent Sales</div>
              
              <div className="sales-table">
                <div className="table-header">
                  <div className="table-col table-col-date">Date & Time</div>
                  <div className="table-col table-col-product">Product</div>
                  <div className="table-col table-col-qty">Quantity</div>
                  <div className="table-col table-col-total">Total</div>
                  <div className="table-col table-col-status">Status</div>
                </div>
                
                <div className="table-body">
                  {completedSales.length === 0 ? (
                    <div className="table-empty">No sales yet</div>
                  ) : (
                    completedSales.map((sale) => (
                      <div key={sale.id} className="table-row">
                        <div className="table-col table-col-date">{sale.date}</div>
                        <div className="table-col table-col-product">{sale.product}</div>
                        <div className="table-col table-col-qty">{sale.quantity}</div>
                        <div className="table-col table-col-total">${sale.total.toFixed(2)}</div>
                        <div className="table-col table-col-status"><span className="status-completed">Completed</span></div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}