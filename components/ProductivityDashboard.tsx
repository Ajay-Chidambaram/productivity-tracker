import React from 'react';
import { ProductivityData, CategoryData, CategoryObject, Category } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface DashboardProps {
  data: ProductivityData;
  categoryData: CategoryData[];
  categories: CategoryObject[];
  onSummarize: () => void;
  loading: boolean;
}

const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M15.5 2.1a.5.5 0 00-.5-.5H5a.5.5 0 00-.5.5v15.8a.5.5 0 00.5.5H15a.5.5 0 00.5-.5V2.1zM5.125 3.1h9.75v13.8h-9.75V3.1z" />
    <path d="M7.5 14.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-1.875a.5.5 0 00-.5-.5h-4a.5.5 0 00-.5.5V14.5zM8 12.625h4v1.875H8V12.625zM7.5 9.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5V7.625a.5.5 0 00-.5-.5h-4a.5.5 0 00-.5.5V9.5zM8 7.625h4v1.875H8V7.625z" />
  </svg>
);

const ProductivityDashboard: React.FC<DashboardProps> = ({ data, categoryData, categories, onSummarize, loading }) => {
  const chartData = [
    { name: 'Completed', value: data.completed },
    { name: 'Pending', value: data.pending },
  ];

  const PIE_COLORS = ['#4f46e5', '#d1d5db']; // indigo-600, gray-300

  const getCategoryFill = (name: Category) => {
    const category = categories.find(c => c.name === name);
    return category ? category.visuals.fill : '#9ca3af'; // default gray
  };

  const yAxisTickFormatter = (value: string) => {
    const category = categories.find(c => c.name === value);
    return category ? category.emoji : value;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6 sticky top-8">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-3xl font-bold fill-slate-800">
              {`${data.percentage}%`}
            </text>
            <text x="50%" y="65%" textAnchor="middle" dominantBaseline="central" className="text-sm font-medium fill-slate-500">
              Done
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-slate-500">Total Tasks</p>
          <p className="text-2xl font-bold text-slate-800">{data.total}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-green-600">Completed</p>
          <p className="text-2xl font-bold text-green-700">{data.completed}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-slate-700 mb-2">Time per Category (min)</h3>
        {categoryData.length > 0 ? (
          <div className="h-56 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  width={30} 
                  stroke="#64748b" 
                  tickFormatter={yAxisTickFormatter}
                />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}} 
                  formatter={(value: number, name: string) => [`${value.toFixed(1)} min`, name]} 
                />
                <Bar dataKey="time" radius={[0, 4, 4, 0]} barSize={20}>
                  {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryFill(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-6 px-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500">Track time on a task to see your stats here!</p>
          </div>
        )}
      </div>

       <button
        onClick={onSummarize}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-900 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800"
      >
        {loading ? (
             <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Summarizing...
            </>
        ) : (
            <>
                <ChartIcon className="w-5 h-5" />
                Summarize My Day
            </>
        )}
      </button>

    </div>
  );
};

export default ProductivityDashboard;
