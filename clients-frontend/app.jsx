// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ClientsListPage from './pages/ClientsListPage';
import AddClientPage from './pages/AddClientPage';
import EditClientPage from './pages/EditClientPage';
import ViewClientPage from './pages/ViewClientPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LogsPage from './pages/LogsPage';

function App() {
  return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-fill">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/clients" element={<ClientsListPage />} />
            <Route path="/clients/add" element={<AddClientPage />} />
            <Route path="/clients/analytics" element={<AnalyticsPage />} />
            <Route path="/clients/edit/:id" element={<EditClientPage />} />
            <Route path="/clients/view/:id" element={<ViewClientPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
  );
}

export default App;

