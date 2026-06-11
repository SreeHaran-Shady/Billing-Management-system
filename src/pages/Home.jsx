import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { summaryApi } from '../api';
import {
  Package, FileText, BarChart2, TrendingUp, TrendingDown, PieChart,
  ShoppingCart, DollarSign, ArrowDownCircle, Wallet
} from 'lucide-react';

const navCards = [
  { label: 'Master (Parts)', desc: 'Add and Manage Parts', path: '/master', icon: Package, color: '#1e40af', bg: '#dbeafe', btn: '#1e40af', btnText: 'Go to Master' },
  { label: 'Billing', desc: 'Generate Bill', path: '/billing', icon: FileText, color: '#059669', bg: '#d1fae5', btn: '#059669', btnText: 'Go to Billing' },
  { label: 'Reports', desc: 'View All Bills', path: '/reports', icon: BarChart2, color: '#7c3aed', bg: '#ede9fe', btn: '#7c3aed', btnText: 'Go to Reports' },
  { label: 'Income', desc: 'View Income', path: '/income', icon: TrendingUp, color: '#0891b2', bg: '#cffafe', btn: '#0891b2', btnText: 'Go to Income' },
  { label: 'Expenses', desc: 'View Expenses', path: '/expenses', icon: TrendingDown, color: '#dc2626', bg: '#fee2e2', btn: '#dc2626', btnText: 'Go to Expenses' },
  { label: 'Income & Expenses', desc: 'View Summary', path: '/summary', icon: PieChart, color: '#d97706', bg: '#fef3c7', btn: '#d97706', btnText: 'Go to Summary' },
];

const fmt = (val) => `₹ ${Number(val || 0).toLocaleString('en-IN')}`;

export default function Home() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    summaryApi.today().then(r => setSummary(r.data)).catch(() => {});
  }, []);

  const kpis = [
    { label: "Total Sales (Today)", value: fmt(summary?.totalSales), icon: ShoppingCart, bg: '#dbeafe', color: '#1e40af' },
    { label: "Total Income (Today)", value: fmt(summary?.totalIncome), icon: DollarSign, bg: '#d1fae5', color: '#059669' },
    { label: "Total Expenses (Today)", value: fmt(summary?.totalExpenses), icon: ArrowDownCircle, bg: '#fee2e2', color: '#dc2626' },
    { label: "Net Profit (Today)", value: fmt(summary?.netProfit), icon: Wallet, bg: '#fef3c7', color: '#d97706' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Home Dashboard</h1>
        <p>Welcome to Manufacturing Billing Software — Complete Solution for Parts Management, Billing, Reports, Income &amp; Expenses</p>
      </div>

      <div className="nav-cards-grid">
        {navCards.map(({ label, desc, path, icon: Icon, color, bg, btn, btnText }) => (
          <div className="nav-card" key={path} onClick={() => navigate(path)}>
            <div className="nav-card-icon" style={{ background: bg }}>
              <Icon size={24} color={color} />
            </div>
            <h4>{label}</h4>
            <p>{desc}</p>
            <button
              className="nav-card-btn"
              style={{ background: btn, color: 'white' }}
              onClick={e => { e.stopPropagation(); navigate(path); }}
            >
              {btnText}
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Today's Summary</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-IN')}</span>
        </div>
        <div className="card-body">
          <div className="kpi-grid">
            {kpis.map(({ label, value, icon: Icon, bg, color }) => (
              <div className="kpi-card" key={label}>
                <div className="kpi-icon" style={{ background: bg }}>
                  <Icon size={20} color={color} />
                </div>
                <div className="kpi-info">
                  <p>{label}</p>
                  <div className="kpi-value" style={{ color }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
