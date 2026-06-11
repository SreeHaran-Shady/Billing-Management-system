import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Master from './pages/Master';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Summary from './pages/Summary';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/master" element={<Master />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
