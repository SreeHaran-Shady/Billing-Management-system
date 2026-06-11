import { useEffect, useState, useCallback } from 'react';
import { partsApi, billsApi } from '../api';
import { PlusCircle, Trash2, Save, RefreshCw, X, FileText } from 'lucide-react';

function toWords(n) {
  if (!n || isNaN(n)) return '';
  const num = Math.floor(Number(n));
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };

  return num === 0 ? 'Zero Rupees Only' : convert(num) + ' Rupees Only';
}

const today = () => new Date().toISOString().split('T')[0];

export default function Billing() {
  const [parts, setParts] = useState([]);
  const [billNo, setBillNo] = useState('');
  const [form, setForm] = useState({ date: today(), customerName: '', partId: '', description: '', stock: 0, price: 0, qty: 1 });
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadNext = useCallback(() => {
    billsApi.nextNumber().then(r => setBillNo(r.data.billNo)).catch(() => {});
  }, []);

  useEffect(() => {
    partsApi.getAll().then(r => setParts(r.data));
    loadNext();
  }, [loadNext]);

  const handlePartChange = e => {
    const part = parts.find(p => p.id === Number(e.target.value));
    if (part) {
      setForm(f => ({ ...f, partId: part.id, description: part.description, stock: part.stock, price: part.price, qty: 1 }));
    }
  };

  const addItem = () => {
    const part = parts.find(p => p.id === Number(form.partId));
    if (!part) return;
    const qty = Number(form.qty);
    if (qty <= 0 || qty > form.stock) { setMsg({ type: 'danger', text: `Qty must be between 1 and ${form.stock}` }); return; }
    setItems(prev => [...prev, {
      partNo: part.partNo, description: part.description,
      quantity: qty, price: Number(form.price),
      amount: qty * Number(form.price)
    }]);
    setForm(f => ({ ...f, partId: '', description: '', stock: 0, price: 0, qty: 1 }));
    setMsg(null);
  };

  const removeItem = idx => setItems(prev => prev.filter((_, i) => i !== idx));

  const total = items.reduce((s, i) => s + i.amount, 0);

  const handleSave = async () => {
    if (!form.customerName.trim()) { setMsg({ type: 'danger', text: 'Enter customer name' }); return; }
    if (items.length === 0) { setMsg({ type: 'danger', text: 'Add at least one item' }); return; }
    setSaving(true);
    try {
      await billsApi.save({ billNo, date: form.date, customerName: form.customerName, totalAmount: total, billItems: items });
      setMsg({ type: 'success', text: `Bill ${billNo} saved successfully!` });
      handleNew();
    } catch {
      setMsg({ type: 'danger', text: 'Failed to save bill' });
    } finally { setSaving(false); }
  };

  const handleNew = () => {
    setItems([]);
    setForm({ date: today(), customerName: '', partId: '', description: '', stock: 0, price: 0, qty: 1 });
    loadNext();
    partsApi.getAll().then(r => setParts(r.data));
  };

  const handleClear = () => { setItems([]); setMsg(null); };

  return (
    <div>
      <div className="page-header">
        <h1>Billing</h1>
        <p>Generate bills for customers</p>
      </div>

      {msg && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

      <div className="two-col">
        {/* Left: Bill Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header"><h3>Bill Details</h3></div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Bill No</label>
                    <input className="form-control" value={billNo} disabled />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input className="form-control" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Customer Name</label>
                  <input className="form-control" placeholder="Enter customer name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Select Part</label>
                  <select className="form-control" value={form.partId} onChange={handlePartChange}>
                    <option value="">-- Select Part --</option>
                    {parts.map(p => <option key={p.id} value={p.id}>{p.partNo} - {p.description}</option>)}
                  </select>
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Description</label>
                    <input className="form-control" value={form.description} disabled />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input className="form-control" value={form.stock} disabled />
                  </div>
                </div>
                <div className="form-grid form-grid-2">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input className="form-control" value={form.price} disabled />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input className="form-control" type="number" min="1" max={form.stock} value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} />
                  </div>
                </div>
                <button className="btn btn-primary" onClick={addItem} style={{ width: '100%' }}>
                  <PlusCircle size={15} /> Add to Bill
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Bill Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div className="card-header">
              <h3>Bill Summary</h3>
              {billNo && <span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>{billNo}</span>}
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {items.length === 0 ? (
                <div className="empty-state" style={{ padding: 30 }}><FileText /><p>No items added yet</p></div>
              ) : (
                <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                  <table>
                    <thead>
                      <tr><th>Part No</th><th>Description</th><th>Qty</th><th>Price (₹)</th><th>Amount (₹)</th><th></th></tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i}>
                          <td>{item.partNo}</td>
                          <td>{item.description}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price.toLocaleString('en-IN')}</td>
                          <td style={{ fontWeight: 600 }}>₹{item.amount.toLocaleString('en-IN')}</td>
                          <td><button className="btn btn-danger btn-sm" onClick={() => removeItem(i)}><Trash2 size={12} /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <>
              <div className="total-row">
                <span>TOTAL AMOUNT (₹)</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="words-box">
                <div className="words-label">Total in Words</div>
                <div className="words-text">{toWords(total)}</div>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-success" onClick={handleSave} disabled={saving || items.length === 0}>
              <Save size={15} /> {saving ? 'Saving...' : 'Save Bill'}
            </button>
            <button className="btn btn-warning" onClick={handleNew}><RefreshCw size={15} /> New Bill</button>
            <button className="btn btn-outline" onClick={handleClear}><X size={15} /> Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
}
