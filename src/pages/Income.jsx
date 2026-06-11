import { useState } from 'react';
import { incomeApi } from '../api';
import { Search, Trash2, TrendingUp } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

export default function Income() {
  const [date, setDate] = useState(today());
  const [records, setRecords] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    incomeApi.getByDate(date)
      .then(r => { setRecords(r.data); setLoaded(true); })
      .finally(() => setLoading(false));
  };

  const handleDelete = async id => {
    if (!confirm('Delete this record?')) return;
    await incomeApi.delete(id);
    load();
  };

  const total = records.reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Income</h1>
        <p>View income records by date</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Income Report</h3>
          <div className="filter-bar">
            <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: 150 }} />
            <button className="btn btn-primary" onClick={load}><Search size={14} /> Show</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading"><div className="spinner" /> Loading...</div>
          ) : !loaded ? (
            <div className="empty-state"><TrendingUp /><p>Select a date and click Show</p></div>
          ) : records.length === 0 ? (
            <div className="empty-state"><p>No income records for this date</p></div>
          ) : (
            <>
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr><th>#</th><th>Date</th><th>Source / Description</th><th>Amount (₹)</th><th></th></tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={r.id}>
                        <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td>{r.date}</td>
                        <td>{r.description}</td>
                        <td style={{ fontWeight: 600, color: 'var(--success)' }}>₹{Number(r.amount).toLocaleString('en-IN')}</td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}><Trash2 size={12} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="total-row" style={{ margin: 16, marginTop: 12 }}>
                <span>TOTAL INCOME (₹)</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
