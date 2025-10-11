import React from "react";
import {NavLink} from "react-router-dom";
import {Briefcase, Eye, FileText, LayoutDashboard, Settings} from "lucide-react";
import {cn} from "../lib/utils";

const navItems = [
    {name: "Dashboard", icon: LayoutDashboard, path: "/"},
    {name: "Portfolio", icon: Briefcase, path: "/portfolio"},
    {name: "Watchlist", icon: Eye, path: "/watchlist"},
    {name: "Financials", icon: FileText, path: "/financials"},
    {name: "Settings", icon: Settings, path: "/settings"},
];

export const Sidebar: React.FC = () => {
    return (
        <aside className="w-56 h-screen bg-background border-r fixed left-0 top-0 flex flex-col">
            <div className="p-4 text-lg font-bold border-b">StockMate</div>
            <nav className="flex-1 overflow-y-auto">
                <ul className="space-y-1 mt-2">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({isActive}) =>
                                    cn(
                                        "flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted text-muted-foreground"
                                    )
                                }
                            >
                                <item.icon className="w-4 h-4"/>
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t text-xs text-muted-foreground">
                © {new Date().getFullYear()} StockMate
            </div>
        </aside>
    );
};
