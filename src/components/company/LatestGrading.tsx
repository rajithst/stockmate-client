import React from 'react';
import { Card } from '../ui/card';
import { ArrowDown, ArrowRight, ArrowUp, Minus } from 'lucide-react';

interface CompanyGrading {
  symbol: string;
  date: string;
  grading_company: string;
  previous_grade: string;
  new_grade: string;
  action: string;
}

interface Props {
  gradings: CompanyGrading[];
}

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

const LatestGrading: React.FC<Props> = ({ gradings }) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-800">Latest Analyst Gradings</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {gradings.map((g, i) => {
          const { icon, color } = getActionStyle(g.action);
          const prevGradeStyle = getGradeStyle(g.previous_grade);
          const newGradeStyle = getGradeStyle(g.new_grade);

          return (
            <Card
              key={`${g.symbol}-${i}`}
              className="p-3 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-150 rounded-xl text-sm leading-tight flex flex-col gap-2"
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
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LatestGrading;
