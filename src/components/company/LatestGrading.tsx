import React from 'react';
import { Card } from '../ui/card';
import { ArrowDown, ArrowUp, Minus, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import type { CompanyGradingRead } from '../../types';

// --- 🎨 Grading Color Logic ---
const getGradeStyle = (grade: string | null | undefined) => {
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
const getActionStyle = (action: string | null | undefined) => {
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
  // Handle empty data
  if (!latest_gradings || latest_gradings.length === 0) {
    return (
      <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-xl p-4">
        {/* Decorative Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h2 className="text-base font-bold text-gray-800">Latest Analyst Gradings</h2>
          </div>
          <p className="text-xs text-gray-500 mb-3">Recent actions</p>
          <div className="flex items-center justify-center py-4">
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <AlertCircle className="w-6 h-6 text-gray-400" />
              <span className="text-xs font-medium">No grading data available</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  return (
    <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-xl p-4">
      {/* Decorative Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <h2 className="text-base font-bold text-gray-800">Analyst Gradings</h2>
        </div>
        <p className="text-xs text-gray-500 mb-3">Recent actions</p>
        <div className="space-y-1.5 flex-1">
          {latest_gradings.slice(0, 6).map((g, i) => {
            const { icon, color } = getActionStyle(g.action);
            const newGradeStyle = getGradeStyle(g.new_grade);

            return (
              <div
                key={`${g.symbol}-${i}`}
                className="p-2 border border-gray-100 rounded-lg text-xs bg-white/60 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="font-medium text-gray-700 truncate max-w-[100px]">
                    {g.grading_company}
                  </span>
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-gray-500 flex-shrink-0">
                    {typeof g.date === 'string'
                      ? new Date(g.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : g.date?.toString().split('T')[0]}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div
                    className={`flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full border ${color}`}
                  >
                    {icon}
                    <span className="capitalize text-xs">{g.action}</span>
                  </div>
                  <span
                    className={`font-semibold text-xs px-2 py-0.5 rounded-full border ${newGradeStyle}`}
                  >
                    {g.new_grade || '-'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {latest_gradings.length > 6 && (
          <div className="text-xs text-gray-500 mt-2 text-center">
            +{latest_gradings.length - 6} more gradings
          </div>
        )}

        {/* Last updated - Bottom */}
        {latest_gradings.length > 0 && (
          <div className="flex items-center justify-end pt-2 mt-2 border-t border-gray-100">
            <span className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1 text-xs text-gray-500 shadow-sm">
              <Clock className="w-3 h-3 text-gray-400" />
              Last updated:{' '}
              {typeof latest_gradings[0].date === 'string'
                ? new Date(latest_gradings[0].date).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : latest_gradings[0].date?.toString().split('T')[0]}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default LatestGrading;
