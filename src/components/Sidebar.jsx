import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, FileText, BarChart2,
  TrendingUp, TrendingDown, PieChart, LogOut
} from 'lucide-react';

const nav = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Master (Parts)', path: '/master', icon: Package },
  { label: 'Billing', path: '/billing', icon: FileText },
  { label: 'Reports', path: '/reports', icon: BarChart2 },
  { label: 'Income', path: '/income', icon: TrendingUp },
  { label: 'Expenses', path: '/expenses', icon: TrendingDown },
  { label: 'Summary', path: '/summary', icon: PieChart },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">M</div>
        <h2>MBS</h2>
        <p>Manufacturing Billing Software</p>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Navigation</div>
        {nav.map(({ label, path, icon: Icon }) => (
          <button
            key={path}
            className={`nav-item ${pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" style={{ width: '100%' }}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
