import React from 'react';
import { DailyBreakdownEntry } from '../types';
import { AcademicCapIcon, BeakerIcon } from './icons';

interface DailyBreakdownProps {
  data: DailyBreakdownEntry[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
};

const DailyBreakdown: React.FC<DailyBreakdownProps> = ({ data }) => {
  return (
    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg h-full flex flex-col">
      <h2 className="text-lg font-semibold text-white mb-2">Détail du mois</h2>
      <p className="text-slate-400 text-sm mb-4">Transactions journalières</p>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {data.length > 0 ? (
          <ul className="space-y-3">
            {data.map((entry) => (
              <li key={entry.date} className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-300 text-sm">{formatDate(entry.date)}</span>
                  <div className="text-right">
                    <p className="font-bold text-white">{entry.total.toLocaleString('fr-FR')} €</p>
                    <p className="text-xs text-slate-400">{entry.nbEleves} {entry.nbEleves > 1 ? 'élèves' : 'élève'}</p>
                  </div>
                </div>
                 <div className="flex justify-end items-center gap-4 mt-2 text-xs text-slate-400 border-t border-slate-800 pt-2">
                  <div className="flex items-center gap-1.5">
                    <AcademicCapIcon className="h-4 w-4" />
                    <span>Profs: {entry.totalProf.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BeakerIcon className="h-4 w-4" />
                    <span>Bar: {entry.totalBar.toLocaleString('fr-FR')} €</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>Aucune transaction pour le mois en cours.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyBreakdown;
