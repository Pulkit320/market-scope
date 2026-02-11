import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import AssetDetail from '@/pages/AssetDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="asset/:id" element={<AssetDetail />} />
          <Route path="market" element={<div className="p-4">Market View (Coming Soon)</div>} />
          <Route path="settings" element={<div className="p-4">Settings (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
