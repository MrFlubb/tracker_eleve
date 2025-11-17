import React from 'react';
import { MonthlySummaryData } from '../types';
import { AcademicCapIcon, BeakerIcon } from './icons';

interface MonthlySummaryProps {
  data: MonthlySummaryData;
}

const MonthlySummary: React.FC<MonthlySummaryProps> = ({ data }) => {
  return (
    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg h-full">
      <h2 className="text-lg font-semibold text-white mb-2">Vue mensuelle</h2>
      <p className="text-slate-400 text-sm mb-4">Synthèse des revenus</p>
      <div className="space-y-4">
        <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
          <p className="text-sm text-slate-400">Mois en cours</p>
          <p className="text-2xl font-bold text-white mt-1">{data.currentMonth.total.toLocaleString('fr-FR')} €</p>
           <div className="flex justify-between items-center mt-2 text-xs text-slate-400 border-t border-slate-800 pt-2">
            <div className="flex items-center gap-1.5">
              <AcademicCapIcon className="h-4 w-4" />
              <span>Profs: {data.currentMonth.totalProf.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BeakerIcon className="h-4 w-4" />
              <span>Bar: {data.currentMonth.totalBar.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{data.currentMonth.dateRange}</p>
        </div>
        <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
          <p className="text-sm text-slate-400">Mois précédent</p>
          <p className="text-2xl font-bold text-white mt-1">{data.previousMonth.total.toLocaleString('fr-FR')} €</p>
          <div className="flex justify-between items-center mt-2 text-xs text-slate-400 border-t border-slate-800 pt-2">
            <div className="flex items-center gap-1.5">
              <AcademicCapIcon className="h-4 w-4" />
              <span>Profs: {data.previousMonth.totalProf.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BeakerIcon className="h-4 w-4" />
              <span>Bar: {data.previousMonth.totalBar.toLocaleString('fr-FR')} €</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">{data.previousMonth.dateRange}</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummary;
