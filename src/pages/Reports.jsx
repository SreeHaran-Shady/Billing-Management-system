import { useEffect, useState } from 'react';
import { billsApi } from '../api';
import * as XLSX from 'xlsx';
import { Download, Receipt } from 'lucide-react';

export default function Reports() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    billsApi.getAll()
      .then(r => setBills(r.data))
      .finally(() => setLoading(false));
  }, []);

  const exportExcel = () => {
    const data = bills.map((b, i) => ({
      '#': i + 1,
      'Bill No': b.billNo,
      'Date': b.date,
      'Customer Name': b.customerName,
      'Total Amount (₹)': Number(b.totalAmount),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bills');
    XLSX.writeFile(wb, `Bills_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const total = bills.reduce((s, b) => s + Number(b.totalAmount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>All generated bills</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Bills Report</h3>
          <button className="btn btn-success btn-sm" onClick={exportExcel}>
            <Download size={14} /> Export to Excel
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div className="loading"><div className="spinner" /> Loading bills...</div>
          ) : bills.length === 0 ? (
            <div className="empty-state"><Receipt /><p>No bills found</p></div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table>
                <thead>
                  <tr><th>#</th><th>Bill No</th><th>Date</th><th>Customer Name</th><th>Total Amount (₹)</th></tr>
                </thead>
                <tbody>
                  {bills.map((b, i) => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                      <td><span className="badge" style={{ background: '#dbeafe', color: '#1e40af' }}>{b.billNo}</span></td>
                      <td>{b.date}</td>
                      <td>{b.customerName}</td>
                      <td style={{ fontWeight: 600 }}>₹{Number(b.totalAmount).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'right' }}>Total</td>
                    <td style={{ color: 'var(--primary)' }}>₹{total.toLocaleString('en-IN')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
