import React from 'react';
import { MonthlySummaryData } from '../types';

interface MonthlySummaryProps {
  data: MonthlySummaryData;
}

const AcademicCapIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" />
  </svg>
);

const BeakerIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l.477-2.387a2 2 0 01.547-1.806z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.25l1.586-1.586a2 2 0 00-2.828-2.828l-1.586 1.586a2 2 0 002.828 2.828z" />
  </svg>
);

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
              <AcademicCapIcon />
              <span>Profs: {data.currentMonth.totalProf.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BeakerIcon />
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
              <AcademicCapIcon />
              <span>Profs: {data.previousMonth.totalProf.toLocaleString('fr-FR')} €</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BeakerIcon />
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
