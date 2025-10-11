import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {AppLayout} from "./layout/AppLayout.tsx";
import {CompanyPage} from "./pages/Company.tsx";
import FinancialsPage from "./pages/Financials.tsx";
import WatchlistPage from "./pages/Watchlist.tsx";
import Portfolio from "./pages/Portfolio.tsx";


function App() {
    return (
        <Router>
            <AppLayout>
                <Routes>
                    {/*<Route path="/" element={<Dashboard />} />*/}
                    <Route path="/portfolio" element={<Portfolio/>}/>
                    <Route path="/watchlist" element={<WatchlistPage/>}/>
                    {/*<Route path="/financials" element={<Financials />} />*/}
                    <Route path="/company/:symbol" element={<CompanyPage/>}/>
                    <Route path="/financials/:symbol" element={<FinancialsPage/>}/>
                </Routes>
            </AppLayout>
        </Router>
    )
}

export default App
