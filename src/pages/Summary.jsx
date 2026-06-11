import { useState } from 'react';
import { summaryApi } from '../api';
import { Search, PieChart } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];
const fmt = (v) => `₹${Number(v || 0).toLocaleString('en-IN')}`;

export default function Summary() {
  const [date, setDate] = useState(today());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    summaryApi.byDate(date)
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  };

  const netProfit = data ? Number(data.netProfit) : 0;

  return (
    <div>
      <div className="page-header">
        <h1>Income vs Expenses Summary</h1>
        <p>Compare income and expenses for a specific date</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Summary by Date</h3>
          <div className="filter-bar">
            <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: 150 }} />
            <button className="btn btn-primary" onClick={load}>
              <Search size={14} /> Show Summary
            </button>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="loading"><div className="spinner" /> Calculating...</div>
          ) : !data ? (
            <div className="empty-state"><PieChart /><p>Select a date and click Show Summary</p></div>
          ) : (
            <div className="three-col">
              <div className="summary-kpi" style={{ background: '#d1fae5' }}>
                <div className="label" style={{ color: '#065f46' }}>Total Income (₹)</div>
                <div className="value" style={{ color: '#059669' }}>{fmt(data.totalIncome)}</div>
              </div>
              <div className="summary-kpi" style={{ background: '#fee2e2' }}>
                <div className="label" style={{ color: '#7f1d1d' }}>Total Expenses (₹)</div>
                <div className="value" style={{ color: '#dc2626' }}>{fmt(data.totalExpenses)}</div>
              </div>
              <div className="summary-kpi" style={{ background: netProfit >= 0 ? '#dbeafe' : '#fef3c7' }}>
                <div className="label" style={{ color: netProfit >= 0 ? '#1e3a8a' : '#78350f' }}>Net Profit (₹)</div>
                <div className="value" style={{ color: netProfit >= 0 ? '#1e40af' : '#d97706' }}>{fmt(data.netProfit)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
