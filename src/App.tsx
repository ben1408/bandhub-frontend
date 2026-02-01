import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './components/Home/Home';
import BandPage from './components/BandPage/BandPage';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Account from './components/Account/Account';
import Navbar from './components/Navbar/Navbar';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { BandPageProvider } from './context/BandPageContext';
import { ContactUs } from './components/AboutUs/ContactUs';
import { AllBandPage } from './components/AllBandsPage/AllBandPage';
import ArticlesPage from './components/ArticlesPage/ArticlesPage';
import ArticlePage from './components/ArticlePage';
import DashboardPage from './components/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAddedBand, setIsAddedBand] = useState(false);
  const changeBand = () => { setIsAddedBand(!isAddedBand); }

  return (
    <AuthProvider>
      <BandPageProvider>
        <Navbar setIsAddedBand={changeBand} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Home isAddedBand={isAddedBand} />} />
          <Route path="/band/:id" element={<BandPage />} />
          <Route path="/allbandpage" element={<AllBandPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <hr style={{ width: "75%", marginTop: "60px" }} />
        <ContactUs />
      </BandPageProvider>
    </AuthProvider>
  );
}

export default App;
