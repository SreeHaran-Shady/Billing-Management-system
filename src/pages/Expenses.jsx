import { useState } from 'react';
import { expensesApi } from '../api';
import { Search, Trash2, Plus, TrendingDown } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

export default function Expenses() {
  const [date, setDate] = useState(today());
  const [records, setRecords] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ description: '', amount: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    expensesApi.getByDate(date)
      .then(r => { setRecords(r.data); setLoaded(true); })
      .finally(() => setLoading(false));
  };

  const handleAdd = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await expensesApi.create({ date, description: form.description, amount: Number(form.amount) });
      setForm({ description: '', amount: '' });
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this record?')) return;
    await expensesApi.delete(id);
    load();
  };

  const total = records.reduce((s, r) => s + Number(r.amount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Expenses</h1>
        <p>Manage and view expense records by date</p>
      </div>

      <div className="two-col">
        {/* Add Expense Form */}
        <div className="card">
          <div className="card-header"><h3>Add Expense</h3></div>
          <div className="card-body">
            <form onSubmit={handleAdd}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Date</label>
                  <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Expense Description</label>
                  <input className="form-control" placeholder="e.g. Raw Materials" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input className="form-control" type="number" min="0" step="0.01" placeholder="e.g. 1500" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Plus size={15} /> Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="card">
          <div className="card-header">
            <h3>Expenses Report</h3>
            <div className="filter-bar">
              <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: 150 }} />
              <button className="btn btn-primary" onClick={load}><Search size={14} /> Show</button>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div className="loading"><div className="spinner" /> Loading...</div>
            ) : !loaded ? (
              <div className="empty-state"><TrendingDown /><p>Select a date and click Show</p></div>
            ) : records.length === 0 ? (
              <div className="empty-state"><p>No expense records for this date</p></div>
            ) : (
              <>
                <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                  <table>
                    <thead>
                      <tr><th>#</th><th>Date</th><th>Expense Description</th><th>Amount (₹)</th><th></th></tr>
                    </thead>
                    <tbody>
                      {records.map((r, i) => (
                        <tr key={r.id}>
                          <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td>{r.date}</td>
                          <td>{r.description}</td>
                          <td style={{ fontWeight: 600, color: 'var(--danger)' }}>₹{Number(r.amount).toLocaleString('en-IN')}</td>
                          <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}><Trash2 size={12} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="total-row" style={{ margin: 16, marginTop: 12, background: '#fee2e2', color: 'var(--danger)' }}>
                  <span>TOTAL EXPENSES (₹)</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
