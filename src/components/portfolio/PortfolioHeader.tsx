import React from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, TrendingUp, Target, Calendar } from 'lucide-react';

interface PortfolioHeaderProps {
  portfolios: {
    id: string;
    name: string;
    currency: string;
    created_date: string;
    holding_count: number;
  }[];
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
    <div className="mb-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-2xl shadow-xl border-none p-6 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Left Section — Portfolio Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {selected?.name || 'My Portfolio'}
            </h2>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg font-bold text-sm">
              {selected?.currency || 'USD'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>
                Created: <span className="font-semibold">{selected?.created_date}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>
                Holdings: <span className="font-semibold">{selected?.holding_count}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-500" />
              <span>
                Diversification: <span className="font-semibold">Good</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Section — Portfolio Actions */}
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Select value={selectedPortfolioId} onValueChange={onSelect}>
            <SelectTrigger className="w-[220px] bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition">
              <SelectValue placeholder="Select portfolio" />
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition"
          >
            <Plus className="h-4 w-4" /> New Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
};
