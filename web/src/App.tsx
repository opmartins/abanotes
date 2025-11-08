import React from 'react';
// React Router v6 uses <Routes> instead of <Switch> and Route elements use the `element` prop
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
import Records from './pages/Records';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/records" element={<Records />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;