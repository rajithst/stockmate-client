import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import { AppLayout } from './layout/AppLayout.tsx';
import { CompanyPage } from './pages/Company.tsx';
import FinancialsPage from './pages/Financials.tsx';
import WatchlistPage from './pages/Watchlist.tsx';
import HoldingsPage from './pages/Holdings.tsx';
import StockScreener from './pages/Screener.tsx';
import HealthDetails from './pages/HealthDetails.tsx';
import HomePage from './pages/Home.tsx';
import DividendPage from './pages/Dividend.tsx';
import SettingsPage from './pages/Settings.tsx';
import LoginPage from './pages/Login.tsx';
import LandingPage from './pages/Landing.tsx';
import NewsPage from './pages/News.tsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dividend" element={<DividendPage />} />
                    <Route path="/watchlist" element={<WatchlistPage />} />
                    <Route path="/holdings" element={<HoldingsPage />} />
                    <Route path="/screener" element={<StockScreener />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/company/:symbol" element={<CompanyPage />} />
                    <Route path="/financials/:symbol" element={<FinancialsPage />} />
                    <Route path="/health/:symbol" element={<HealthDetails />} />
                    <Route path="*" element={<Navigate to="/app" replace />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
