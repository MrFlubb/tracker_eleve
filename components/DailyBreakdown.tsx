import React from 'react';
import { DailyBreakdownEntry } from '../types';

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
                    <AcademicCapIcon />
                    <span>Profs: {entry.totalProf.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BeakerIcon />
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
