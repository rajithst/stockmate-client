import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "../components/ui/table";
import {Button} from "../components/ui/button";
import {Input} from "../components/ui/input";
import React, {useState} from "react";
import {sampleWatchLists} from "../data/sample_watch_list.tsx";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "../components/ui/dialog.tsx";
import {Link} from "react-router-dom";

interface WatchlistItem {
    symbol: string;
    companyName: string;
    price: number;
    changePercent: number;
    marketCap: number;
    peRatio?: number;
    dividendYield?: number;
}

interface Watchlist {
    id: string;
    name: string;
    currency: string;
    items: WatchlistItem[];
}

const WatchlistPage: React.FC = () => {
    const [watchlists, setWatchlists] = useState<Watchlist[]>(sampleWatchLists);
    const [activeWatchlistId, setActiveWatchlistId] = useState<string>(watchlists[0]?.id || "");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<WatchlistItem[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newWatchlistName, setNewWatchlistName] = useState("");
    const [newWatchlistCurrency, setNewWatchlistCurrency] = useState("USD");

    const activeWatchlist = watchlists.find(wl => wl.id === activeWatchlistId);

    // Add new watchlist
    const addWatchlist = () => {
        if (!newWatchlistName) return;
        const newList: Watchlist = {
            id: Date.now().toString(),
            name: newWatchlistName,
            currency: newWatchlistCurrency,
            items: [],
        };
        setWatchlists(prev => [...prev, newList]);
        setActiveWatchlistId(newList.id);
        setNewWatchlistName("");
        setNewWatchlistCurrency("USD");
        setIsDialogOpen(false);
    };

    const deleteWatchlist = (id: string) => {
        setWatchlists(prev => prev.filter(wl => wl.id !== id));
        if (activeWatchlistId === id) setActiveWatchlistId(watchlists[0]?.id || "");
    };

    const handleSearch = () => {
        const allStocks: WatchlistItem[] = [
            {symbol: "AAPL", companyName: "Apple Inc.", price: 180, changePercent: 1.2, marketCap: 3000000000000},
            {symbol: "MSFT", companyName: "Microsoft Corp.", price: 350, changePercent: -0.5, marketCap: 2800000000000},
            {symbol: "GOOGL", companyName: "Alphabet Inc.", price: 140, changePercent: 0.3, marketCap: 1800000000000},
        ];

        setSearchResults(allStocks.filter(stock =>
            stock.symbol.includes(searchTerm.toUpperCase()) ||
            stock.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    };

    const addStockToActive = (stock: WatchlistItem) => {
        if (!activeWatchlist) return;
        if (activeWatchlist.items.find(item => item.symbol === stock.symbol)) return;

        setWatchlists(prev =>
            prev.map(wl =>
                wl.id === activeWatchlist.id ? {...wl, items: [...wl.items, stock]} : wl
            )
        );
        setSearchResults([]);
        setSearchTerm("");
    };

    const removeStock = (symbol: string) => {
        if (!activeWatchlist) return;
        setWatchlists(prev =>
            prev.map(wl =>
                wl.id === activeWatchlist.id
                    ? {...wl, items: wl.items.filter(item => item.symbol !== symbol)}
                    : wl
            )
        );
    };

    return (
        <Card className="rounded-2xl shadow-sm border border-gray-200">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">My Watchlists</CardTitle>
                <Button onClick={() => setIsDialogOpen(true)}>Create Watchlist</Button>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Watchlist selector */}
                <div className="flex gap-2 items-center flex-wrap">
                    {watchlists.map(wl => (
                        <Button
                            key={wl.id}
                            variant={wl.id === activeWatchlistId ? "default" : "outline"}
                            onClick={() => setActiveWatchlistId(wl.id)}
                        >
                            {wl.name} ({wl.currency})
                            <span className="ml-1 text-red-500 cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                deleteWatchlist(wl.id);
                            }}>×</span>
                        </Button>
                    ))}
                </div>

                {/* Search bar */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Search by symbol or company"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Search</Button>
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                    <div className="space-y-2">
                        <p className="font-semibold">Search Results:</p>
                        <div className="flex flex-col gap-1">
                            {searchResults.map(stock => (
                                <div key={stock.symbol}
                                     className="flex justify-between items-center p-2 border rounded">
                                    <span>{stock.symbol} - {stock.companyName}</span>
                                    <Button size="sm" onClick={() => addStockToActive(stock)}>Add</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Watchlist Table */}
                {activeWatchlist && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Symbol</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Change (%)</TableHead>
                                <TableHead>Market Cap</TableHead>
                                <TableHead>PE Ratio</TableHead>
                                <TableHead>Dividend Yield</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activeWatchlist.items.map(stock => (
                                <TableRow key={stock.symbol}>
                                    <TableCell>
                                        <Link to={`/company/${stock.symbol}`} className="text-blue-600 hover:underline">
                                            {stock.symbol}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{stock.companyName}</TableCell>
                                    <TableCell>${stock.price.toFixed(2)}</TableCell>
                                    <TableCell className={stock.changePercent >= 0 ? "text-green-600" : "text-red-600"}>
                                        {stock.changePercent.toFixed(2)}%
                                    </TableCell>
                                    <TableCell>{(stock.marketCap / 1_000_000_000).toFixed(2)}B</TableCell>
                                    <TableCell>{stock.peRatio ?? "-"}</TableCell>
                                    <TableCell>{stock.dividendYield ?? "-"}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm"
                                                onClick={() => removeStock(stock.symbol)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            {/* Dialog for creating watchlist */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Create Watchlist</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Input
                            placeholder="Watchlist Name"
                            value={newWatchlistName}
                            onChange={e => setNewWatchlistName(e.target.value)}
                        />
                        <Input
                            placeholder="Currency (e.g., USD)"
                            value={newWatchlistCurrency}
                            onChange={e => setNewWatchlistCurrency(e.target.value.toUpperCase())}
                        />
                    </div>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={addWatchlist}>Create</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default WatchlistPage;
