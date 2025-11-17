import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-gradient-to-br ${color} p-4 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <p className="text-white text-opacity-80 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="bg-white bg-opacity-20 p-2 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;