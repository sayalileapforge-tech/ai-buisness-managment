import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  QrCode, Wallet, Boxes, ShoppingCart, BarChart2, PlusSquare,
  ReceiptText, Banknote, LinkIcon, Users, CreditCard, Settings, Zap, Sparkles
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import TopBar from "../components/TopBar";
import { getProducts, Product } from "../utils/localProductStore";
import "../styles/FinancialReports.css";

type ExpenseLine = {
  label: string;
  amount: number;
};

function fmt(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// Read sales from localStorage (graceful)
function readSales(): any[] {
  try {
    const raw = localStorage.getItem("sales");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error parsing sales from localStorage:", err);
    return [];
  }
}

// Read custom expenses from localStorage, else return defaults matching screenshot
function readOperatingExpenses(): ExpenseLine[] {
  try {
    const raw = localStorage.getItem("expenses");
    if (raw) {
      const parsed = JSON.parse(raw);
      // expect array of { label, amount }
      if (Array.isArray(parsed)) return parsed.map((p: any) => ({ label: p.label, amount: Number(p.amount || 0) }));
    }
  } catch (err) {
    console.warn("Invalid expenses in localStorage", err);
  }

  // Defaults (matching screenshot totals)
  return [
    { label: "Salaries", amount: 120000 },
    { label: "Rent", amount: 24000 },
    { label: "Marketing", amount: 30000 },
    { label: "Utilities", amount: 8000 },
    { label: "Other", amount: 18000 },
  ];
}

export default function FinancialReports() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState<"income" | "balance" | "cash">("income");
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [taxRate] = useState<number>(() => {
    const t = localStorage.getItem("taxRate");
    return t ? Number(t) : 12;
  });

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

  // data sources
  const products: Product[] = getProducts();
  const sales = readSales();
  const operatingExpenses = readOperatingExpenses();

  // Derived calculations
  const { revenue, cogs, grossProfit, totalOperatingExpenses, netBeforeTax, taxAmount, netAfterTax } = useMemo(() => {
    // revenue: sum of each sale line price * qty
    let totalRevenue = 0;
    let totalCOGS = 0;

    for (const sale of sales) {
      const items = Array.isArray(sale.items) ? sale.items : [];
      for (const it of items) {
        const qty = Number(it.quantity || 0);
        const price = Number(it.price || 0);
        totalRevenue += price * qty;

        // find product to get cost price for COGS; if not found, fallback to price * 0.5
        const prod = products.find((p) => p.id === it.productId);
        const costPrice = prod ? Number(prod.cost || 0) : price * 0.5;
        totalCOGS += costPrice * qty;
      }
    }

    const gp = totalRevenue - totalCOGS;
    const totalOp = operatingExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);
    const beforeTax = gp - totalOp;
    const tax = (beforeTax > 0 ? beforeTax : 0) * (Number(taxRate) / 100);
    const afterTax = beforeTax - tax;

    return {
      revenue: Math.round(totalRevenue),
      cogs: Math.round(totalCOGS),
      grossProfit: Math.round(gp),
      totalOperatingExpenses: Math.round(totalOp),
      netBeforeTax: Math.round(beforeTax),
      taxAmount: Math.round(tax),
      netAfterTax: Math.round(afterTax),
    };
  }, [products, sales, operatingExpenses, taxRate]);

  // Balance sheet & cash flow placeholders using simple logic
  const balanceSheet = useMemo(() => {
    // Simple assets = inventory value (stock * cost) + cash (assume netAfterTax)
    const inventoryValue = products.reduce((s, p) => s + Number((p.cost || 0) * (p.stock || 0)), 0);
    const cash = Math.max(netAfterTax, 0);
    const totalAssets = Math.round(inventoryValue + cash);

    // Liabilities: short term payables (example) and equity
    const shortTermDebt = 20000;
    const equity = Math.round(totalAssets - shortTermDebt);

    return {
      inventoryValue: Math.round(inventoryValue),
      cash: Math.round(cash),
      totalAssets,
      shortTermDebt,
      equity,
    };
  }, [products, netAfterTax]);

  const cashFlow = useMemo(() => {
    // Very simple cash flow: cash from operations = netAfterTax + depreciation (0)
    const cashFromOperations = netAfterTax;
    const cashFromInvesting = -5000; // placeholder
    const cashFromFinancing = 0;
    const netChange = cashFromOperations + cashFromInvesting + cashFromFinancing;
    return { cashFromOperations, cashFromInvesting, cashFromFinancing, netChange };
  }, [netAfterTax]);

  // Revenue Breakdown chart data
  const revenueBreakdownData = useMemo(() => {
    return [
      { name: "Sales", value: Math.round(revenue * 0.6), fill: "#d4af37" },
      { name: "COGS", value: Math.round(cogs), fill: "#d4af37" },
      { name: "Operating Expenses", value: Math.round(totalOperatingExpenses), fill: "#d4af37" },
      { name: "Net Profit", value: Math.round(netAfterTax), fill: "#d4af37" },
    ];
  }, [revenue, cogs, totalOperatingExpenses, netAfterTax]);

  function handlePrintReport() {
    window.print();
  }

  function handleExportPDF() {
    // Create a simple PDF by opening print dialog with "Save as PDF"
    alert("PDF export functionality would typically use jsPDF or html2pdf library. For now, use 'Print' to save as PDF.");
    window.print();
    setShowReportMenu(false);
  }

  function handleExportCSV() {
    // Generate CSV data
    const csvData = [
      ["Financial Reports"],
      ["Generated on", new Date().toLocaleDateString()],
      [""],
      ["INCOME STATEMENT"],
      ["Revenue", fmt(revenue)],
      ["Cost of Goods Sold", fmt(-cogs)],
      ["Gross Profit", fmt(grossProfit)],
      ...operatingExpenses.map((e) => [e.label, fmt(-Math.round(e.amount))]),
      ["Total Operating Expenses", fmt(-totalOperatingExpenses)],
      ["Net Income Before Tax", fmt(netBeforeTax)],
      ["Tax (" + taxRate + "%)", fmt(-taxAmount)],
      ["Net Income After Tax", fmt(netAfterTax)],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    setShowReportMenu(false);
  }

  function handleViewTaxSummary() {
    alert(`Tax Summary\n\nNet Income Before Tax: ${fmt(netBeforeTax)}\nTax Rate: ${taxRate}%\nTax Amount: ${fmt(taxAmount)}\nNet Income After Tax: ${fmt(netAfterTax)}\n\nTax Effective Rate: ${((taxAmount / (netBeforeTax > 0 ? netBeforeTax : 1)) * 100).toFixed(2)}%`);
    setShowReportMenu(false);
  }

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
            const isActive = idx === 7;

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
      <div className="fr-header">
        <div>
          <h2>Financial Reports</h2>
          <p className="fr-sub">Comprehensive financial statements and analysis</p>
        </div>

        <div className="fr-actions">
          <div className="report-menu-wrapper">
            <button className="btn-generate" onClick={() => setShowReportMenu(!showReportMenu)}>
              Generate Report
            </button>
            {showReportMenu && (
              <div className="report-menu-dropdown">
                <div className="report-menu-item" onClick={handlePrintReport}>
                  Generate Report
                </div>
                <div className="report-menu-item" onClick={handleExportPDF}>
                  Export as PDF
                </div>
                <div className="report-menu-item" onClick={handleExportCSV}>
                  Export as CSV
                </div>
                <div className="report-menu-item" onClick={handleViewTaxSummary}>
                  View Tax Summary
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fr-tabs">
        <button className={tab === "income" ? "fr-tab active" : "fr-tab"} onClick={() => setTab("income")}>Income Statement</button>
        <button className={tab === "balance" ? "fr-tab active" : "fr-tab"} onClick={() => setTab("balance")}>Balance Sheet</button>
        <button className={tab === "cash" ? "fr-tab active" : "fr-tab"} onClick={() => setTab("cash")}>Cash Flow Statement</button>
      </div>

      <div className="fr-body">
        {tab === "income" && (
          <div className="income-card">
            <div className="income-title">Income Statement</div>
            <div className="income-sub">For the period ending {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</div>

            <div className="fr-line">
              <div className="fr-left">Revenue</div>
              <div className="fr-right">{fmt(revenue)}</div>
            </div>

            <div className="fr-line small muted">
              <div className="fr-left">Cost of Goods Sold (COGS)</div>
              <div className="fr-right negative">{fmt(-cogs)}</div>
            </div>

            <div className="fr-line total">
              <div className="fr-left">Gross Profit</div>
              <div className="fr-right positive">{fmt(grossProfit)}</div>
            </div>

            <div className="section-divider" />

            <div className="section-title">Operating Expenses</div>
            {operatingExpenses.map((e) => (
              <div key={e.label} className="fr-line small">
                <div className="fr-left">{e.label}</div>
                <div className="fr-right negative">{fmt(-Math.round(e.amount))}</div>
              </div>
            ))}

            <div className="fr-line total">
              <div className="fr-left">Total Operating Expenses</div>
              <div className="fr-right negative">{fmt(-totalOperatingExpenses)}</div>
            </div>

            <div className="section-divider" />

            <div className="fr-line">
              <div className="fr-left">Net Income Before Tax</div>
              <div className="fr-right">{fmt(netBeforeTax)}</div>
            </div>

            <div className="fr-line small">
              <div className="fr-left">Tax ({taxRate}% - configured)</div>
              <div className="fr-right negative">{fmt(-taxAmount)}</div>
            </div>

            <div className="fr-line total result">
              <div className="fr-left">Net Income After Tax</div>
              <div className="fr-right positive large">{fmt(netAfterTax)}</div>
            </div>
          </div>
        )}

        {tab === "balance" && (
          <div className="balance-card">
            <div className="section-title">Balance Sheet</div>

            <div className="section-sub">As of {new Date().toLocaleDateString()}</div>

            <div className="fr-grid">
              <div>
                <div className="section-subtitle">Assets</div>
                <div className="fr-line small">
                  <div className="fr-left">Inventory Value</div>
                  <div className="fr-right">{fmt(balanceSheet.inventoryValue)}</div>
                </div>
                <div className="fr-line small">
                  <div className="fr-left">Cash & Cash Equivalents</div>
                  <div className="fr-right">{fmt(balanceSheet.cash)}</div>
                </div>
                <div className="fr-line total">
                  <div className="fr-left">Total Assets</div>
                  <div className="fr-right">{fmt(balanceSheet.totalAssets)}</div>
                </div>
              </div>

              <div>
                <div className="section-subtitle">Liabilities & Equity</div>
                <div className="fr-line small">
                  <div className="fr-left">Short-term debt</div>
                  <div className="fr-right negative">{fmt(-balanceSheet.shortTermDebt)}</div>
                </div>
                <div className="fr-line total">
                  <div className="fr-left">Total Liabilities & Equity</div>
                  <div className="fr-right">{fmt(balanceSheet.totalAssets)}</div>
                </div>
                <div className="fr-line small">
                  <div className="fr-left">Equity</div>
                  <div className="fr-right positive">{fmt(balanceSheet.equity)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "cash" && (
          <div className="cash-card">
            <div className="section-title">Cash Flow Statement</div>
            <div className="section-sub">For the period</div>

            <div className="fr-line small">
              <div className="fr-left">Cash from Operating Activities</div>
              <div className="fr-right">{fmt(cashFlow.cashFromOperations)}</div>
            </div>

            <div className="fr-line small">
              <div className="fr-left">Cash from Investing Activities</div>
              <div className="fr-right negative">{fmt(cashFlow.cashFromInvesting)}</div>
            </div>

            <div className="fr-line small">
              <div className="fr-left">Cash from Financing Activities</div>
              <div className="fr-right">{fmt(cashFlow.cashFromFinancing)}</div>
            </div>

            <div className="fr-line total">
              <div className="fr-left">Net Change in Cash</div>
              <div className="fr-right">{fmt(cashFlow.netChange)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Revenue Breakdown Chart Section */}
      <div className="revenue-breakdown-section">
        <h3 className="section-title">Revenue Breakdown</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={revenueBreakdownData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis 
                dataKey="name" 
                stroke="#888"
                style={{ fontSize: "12px" }}
              />
              <YAxis 
                stroke="#888"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value: any) => [fmt(Number(value)), ""]}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {revenueBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
        </div>
      </main>
    </div>
  );
}
