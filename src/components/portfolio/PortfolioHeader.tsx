import React from "react";
import {Button} from "../ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import {Plus} from "lucide-react";

interface PortfolioHeaderProps {
    portfolios: { id: string; name: string; currency: string, created_date: string, holding_count: number }[];
    selectedPortfolioId: string;
    onSelect: (id: string) => void;
    onCreate: () => void;
}

export const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
                                                                    portfolios,
                                                                    selectedPortfolioId,
                                                                    onSelect,
                                                                    onCreate,
                                                                }) => {
    const selected = portfolios.find((p) => p.id === selectedPortfolioId);

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            {/* Left Section — Portfolio Info */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-900">{selected?.name || "My Portfolio"}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                        {selected?.currency || "USD"}
                      </span>
                    <span>Created: {selected?.created_date}</span>
                    <span>Holdings: {selected?.holding_count}</span>
                </div>
            </div>

            {/* Right Section — Portfolio Actions */}
            <div className="flex items-center gap-3 mt-3 md:mt-0">
                <Select value={selectedPortfolioId} onValueChange={onSelect}>
                    <SelectTrigger className="w-[200px] bg-white border border-gray-200">
                        <SelectValue placeholder="Select portfolio"/>
                    </SelectTrigger>
                    <SelectContent>
                        {portfolios.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                                {p.name} ({p.currency})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    onClick={onCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                    <Plus className="h-4 w-4"/> New
                </Button>
            </div>
        </div>
    );
};
