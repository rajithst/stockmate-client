import React from 'react';
import { Card } from '../ui/card';
import { ArrowDown, ArrowRight, ArrowUp, Minus, Clock } from 'lucide-react';
import type { CompanyGradingRead } from '../../types';

// --- 🎨 Grading Color Logic ---
const getGradeStyle = (grade: string) => {
  const g = grade?.toLowerCase() || '';
  if (g.includes('strong buy')) return 'bg-green-100 text-green-800 border-green-300 font-semibold';
  if (g.includes('buy')) return 'bg-green-50 text-green-700 border-green-200';
  if (g.includes('outperform')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (g.includes('hold')) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  if (g.includes('underperform')) return 'bg-orange-50 text-orange-700 border-orange-200';
  if (g.includes('sell')) return 'bg-red-50 text-red-700 border-red-200';
  if (g.includes('strong sell')) return 'bg-red-100 text-red-800 border-red-300 font-semibold';
  return 'bg-gray-50 text-gray-600 border-gray-200';
};

// --- ⚡ Action Badges ---
const getActionStyle = (action: string) => {
  const a = action?.toLowerCase() || '';
  if (a === 'upgrade')
    return {
      icon: <ArrowUp className="w-4 h-4 text-green-600" />,
      color: 'bg-green-50 text-green-700 border-green-200',
    };
  if (a === 'downgrade')
    return {
      icon: <ArrowDown className="w-4 h-4 text-red-600" />,
      color: 'bg-red-50 text-red-700 border-red-200',
    };
  return {
    icon: <Minus className="w-4 h-4 text-gray-500" />,
    color: 'bg-gray-50 text-gray-700 border-gray-200',
  };
};

const LatestGrading: React.FC<{ latest_gradings: CompanyGradingRead[] }> = ({
  latest_gradings,
}) => {
  // Find the latest updated_at from the gradings
  const lastUpdated = latest_gradings?.length
    ? new Date(
        Math.max(
          ...latest_gradings
            .map((g) => new Date(g.updated_at || g.date).getTime())
            .filter((v) => !isNaN(v)),
        ),
      ).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <Card className="relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl p-6">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="relative z-10">
        <h2 className="text-base font-semibold text-gray-800 mb-1">Latest Analyst Gradings</h2>
        <span className="text-xs text-gray-400 font-medium block mb-4">
          Recent analyst actions and grade changes
        </span>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latest_gradings.map((g, i) => {
            const { icon, color } = getActionStyle(g.action);
            const prevGradeStyle = getGradeStyle(g.previous_grade);
            const newGradeStyle = getGradeStyle(g.new_grade);

            return (
              <div
                key={`${g.symbol}-${i}`}
                className="p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-150 rounded-xl text-sm leading-tight flex flex-col gap-2 bg-white/60"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800 truncate">{g.grading_company}</span>
                  <div
                    className={`flex items-center gap-1 text-xs px-2 py-[2px] rounded-full border ${color}`}
                  >
                    {icon}
                    <span className="capitalize">{g.action}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500">{g.date}</div>

                {/* Grade comparison */}
                <div className="flex justify-between items-center mt-1 border-t border-gray-100 pt-2">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500">Previous</span>
                    <span
                      className={`font-medium text-xs px-2 py-[2px] rounded-full border ${prevGradeStyle}`}
                    >
                      {g.previous_grade || '-'}
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-gray-400" />

                  <div className="flex flex-col items-end">
                    <span className="text-[11px] text-gray-500">New</span>
                    <span
                      className={`font-medium text-xs px-2 py-[2px] rounded-full border ${newGradeStyle}`}
                    >
                      {g.new_grade || '-'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Symbol: {g.symbol}</span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center justify-end pt-4">
            <span className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              Last updated: {lastUpdated}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LatestGrading;
