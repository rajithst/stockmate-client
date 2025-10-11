
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {AppLayout} from "./layout/AppLayout.tsx";
import {CompanyPage} from "./pages/Company.tsx";
import FinancialsPage from "./pages/Financials.tsx";


function App() {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    {/*<Route path="/" element={<Dashboard />} />*/}
                    {/*<Route path="/portfolio" element={<Portfolio />} />*/}
                    {/*<Route path="/watchlist" element={<Watchlist />} />*/}
                    {/*<Route path="/financials" element={<Financials />} />*/}
                    <Route path="/company/:symbol" element={<CompanyPage />} />
                    <Route path="/financials/:symbol" element={<FinancialsPage />} />
                </Routes>
            </AppLayout>
        </Router>
    )
}

export default App
