// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ClientsListPage from './pages/ClientsListPage';
import AddClientPage from './pages/AddClientPage';
import EditClientPage from './pages/EditClientPage';

function App() {
    console.log("App Loaded");
  return (
    <div className="mt-4">
      <Routes>
        <Route path="/" element={<Navigate to="/clients" replace />} />
        <Route path="/clients" element={<ClientsListPage />} />
        <Route path="/clients/add" element={<AddClientPage />} />
        <Route path="/clients/edit/:id" element={<EditClientPage />} />
      </Routes>
    </div>
  );
}

export default App;
