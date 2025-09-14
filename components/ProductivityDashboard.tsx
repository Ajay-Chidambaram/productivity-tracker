import React from 'react';
import { ProductivityData, CategoryData, CategoryObject, Category } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface DashboardProps {
  data: ProductivityData;
  categoryData: CategoryData[];
  categories: CategoryObject[];
}

const ProductivityDashboard: React.FC<DashboardProps> = ({ data, categoryData, categories }) => {
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
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6 sticky top-8 transition-colors">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Daily Dashboard</h2>

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
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="text-3xl font-bold fill-slate-800 dark:fill-slate-100">
              {`${data.percentage}%`}
            </text>
            <text x="50%" y="65%" textAnchor="middle" dominantBaseline="central" className="text-sm font-medium fill-slate-500 dark:fill-slate-400">
              Done
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg transition-colors">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tasks</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{data.total}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg transition-colors">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{data.completed}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200 mb-2">Time per Category (min)</h3>
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
          <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors">
            <p className="text-sm text-slate-500 dark:text-slate-400">Track time on a task to see your stats here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductivityDashboard;
