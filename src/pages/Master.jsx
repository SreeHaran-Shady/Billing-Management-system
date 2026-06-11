import { useEffect, useState } from 'react';
import { partsApi } from '../api';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';

const empty = { partNo: '', description: '', stock: '', price: '' };

export default function Master() {
  const [parts, setParts] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => partsApi.getAll().then(r => setParts(r.data));

  useEffect(() => { load(); }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, stock: Number(form.stock), price: Number(form.price) };
      if (editId) await partsApi.update(editId, payload);
      else await partsApi.create(payload);
      setForm(empty);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.response?.data || 'Failed to save part');
    } finally { setLoading(false); }
  };

  const handleEdit = part => {
    setForm({ partNo: part.partNo, description: part.description, stock: part.stock, price: part.price });
    setEditId(part.id);
    setError('');
  };

  const handleDelete = async id => {
    if (!confirm('Delete this part?')) return;
    await partsApi.delete(id);
    load();
  };

  const handleCancel = () => { setForm(empty); setEditId(null); setError(''); };

  return (
    <div>
      <div className="page-header">
        <h1>Master (Parts)</h1>
        <p>Manage your parts inventory</p>
      </div>

      <div className="two-col">
        {/* Form */}
        <div className="card">
          <div className="card-header">
            <h3>{editId ? '✏️ Edit Part' : '➕ Add New Part'}</h3>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Part No</label>
                  <input className="form-control" name="partNo" placeholder="e.g. 101" value={form.partNo} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Part Description</label>
                  <input className="form-control" name="description" placeholder="e.g. Gear Box" value={form.description} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input className="form-control" name="stock" type="number" min="0" placeholder="e.g. 50" value={form.stock} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input className="form-control" name="price" type="number" min="0" step="0.01" placeholder="e.g. 2000" value={form.price} onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Plus size={15} /> {editId ? 'Update Part' : 'Add Part'}
                </button>
                {editId && <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <h3>Parts List</h3>
            <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>{parts.length} parts</span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {parts.length === 0 ? (
              <div className="empty-state"><Package /><p>No parts added yet</p></div>
            ) : (
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Part No</th>
                      <th>Description</th>
                      <th>Stock</th>
                      <th>Price (₹)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((p, i) => (
                      <tr key={p.id}>
                        <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td><span className="badge" style={{ background: '#f1f5f9', color: '#334155' }}>{p.partNo}</span></td>
                        <td>{p.description}</td>
                        <td>
                          <span className="badge" style={{ background: p.stock < 10 ? '#fee2e2' : '#d1fae5', color: p.stock < 10 ? '#dc2626' : '#059669' }}>
                            {p.stock}
                          </span>
                        </td>
                        <td>₹{Number(p.price).toLocaleString('en-IN')}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-primary btn-sm" onClick={() => handleEdit(p)}><Pencil size={12} /> Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={12} /> Del</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
