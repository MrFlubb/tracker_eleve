
import React, { useState, useEffect, useCallback } from 'react';
import { WebhookData, MonthlySummaryData, DailyBreakdownEntry } from './types';
import DashboardCard from './components/DashboardCard';
import Spinner from './components/Spinner';
import ErrorMessage from './components/ErrorMessage';
import MonthlySummary from './components/MonthlySummary';
import DailyBreakdown from './components/DailyBreakdown';

const WEBHOOK_URL = 'https://workflow.aurelienchardon.com/webhook/nbeleve';
const ADD_STUDENT_5E_URL = 'https://workflow.aurelienchardon.com/webhook/eleve5e';
const ADD_STUDENT_7E_URL = 'https://workflow.aurelienchardon.com/webhook/eleve7e';

const App: React.FC = () => {
  const [data, setData] = useState<WebhookData | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryData | null>(null);
  const [dailyBreakdown, setDailyBreakdown] = useState<DailyBreakdownEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAddingStudent, setIsAddingStudent] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    // Ne pas remettre à true si on fait un refresh en arrière plan
    if (!data) {
      setLoading(true);
    }
    setError(null);
    try {
      const response = await fetch(`${WEBHOOK_URL}?t=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      
      let rawData: any = {};
      if (Array.isArray(result) && result.length > 0) {
        rawData = result[0]?.json || result[0] || {};
      } else if (result && typeof result === 'object' && !Array.isArray(result)) {
        rawData = result.json || result;
      }

      // Daily stats (top cards)
      const todayData = rawData.jour || { total: 0, totalProf: 0, totalBar: 0, nbEleves: 0 };
      setData({
        totalJour: todayData.total,
        totalProf: todayData.totalProf,
        totalBar: todayData.totalBar,
        nbEleves: todayData.nbEleves
      });

      // Monthly Summary
      const currentMonthData = rawData.moisActuel || { total: 0, totalProf: 0, totalBar: 0 };
      const prevMonthData = rawData.moisPrecedent || { total: 0, totalProf: 0, totalBar: 0 };
      
      const now = new Date();
      const currentMonthName = now.toLocaleString('fr-FR', { month: 'long' });
      const lastDayCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthName = prevMonthDate.toLocaleString('fr-FR', { month: 'long' });
      const prevMonthYear = prevMonthDate.getFullYear();

      setMonthlySummary({
        currentMonth: {
          total: currentMonthData.total || 0,
          totalProf: currentMonthData.totalProf || 0,
          totalBar: currentMonthData.totalBar || 0,
          dateRange: `Du 1 au ${lastDayCurrentMonth} ${currentMonthName}`
        },
        previousMonth: {
          total: prevMonthData.total || 0,
          totalProf: prevMonthData.totalProf || 0,
          totalBar: prevMonthData.totalBar || 0,
          dateRange: `${prevMonthName} ${prevMonthYear}`
        }
      });

      // Daily Breakdown
      setDailyBreakdown(rawData.detailsMoisActuel || []);
      
      setLastUpdated(new Date());

    } catch (err) {
      if (err instanceof Error) {
        setError(`Impossible de charger les données : ${err.message}`);
      } else {
        setError('Une erreur inconnue est survenue.');
      }
      setData(null);
      setMonthlySummary(null);
      setDailyBreakdown([]);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleAddStudent = async (url: string) => {
    setIsAddingStudent(true);
    setError(null);
    try {
      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) {
        throw new Error(`La requête a échoué: ${response.statusText}`);
      }
      // Use a small delay to allow n8n to process the data
      setTimeout(fetchData, 500); 
    } catch (err) {
      if (err instanceof Error) {
        setError(`Action impossible : ${err.message}`);
      } else {
        setError("Une erreur inconnue est survenue lors de l'action.");
      }
    } finally {
      setIsAddingStudent(false);
    }
  };

  const cardData = [
    {
      title: "Chiffre d'Affaires du Jour",
      value: data ? `${data.totalJour.toLocaleString('fr-FR')} €` : '0 €',
      icon: <CurrencyEuroIcon />,
      color: 'from-blue-500 to-indigo-600',
      key: 'totalJour'
    },
    {
      title: 'Part Profs (Jour)',
      value: data ? `${data.totalProf.toLocaleString('fr-FR')} €` : '0 €',
      icon: <AcademicCapIcon />,
      color: 'from-green-500 to-emerald-600',
      key: 'totalProf'
    },
    {
      title: 'Part Bar (Jour)',
      value: data ? `${data.totalBar.toLocaleString('fr-FR')} €` : '0 €',
      icon: <BeakerIcon />,
      color: 'from-purple-500 to-violet-600',
      key: 'totalBar'
    },
    {
      title: "Élèves (Jour)",
      value: data ? data.nbEleves.toLocaleString('fr-FR') : '0',
      icon: <UsersIcon />,
      color: 'from-orange-500 to-amber-600',
      key: 'nbEleves'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Tracker d'élèves</h1>
            <p className="text-slate-400 mt-1">Statistiques de la soirée</p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {lastUpdated && !loading && (
              <p className="text-sm text-slate-500">
                Dernière mise à jour : {lastUpdated.toLocaleTimeString('fr-FR')}
              </p>
            )}
            <button
              onClick={() => fetchData()}
              disabled={loading || isAddingStudent}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <RefreshIcon spinning={loading && !!data} />
              <span className="hidden sm:inline">{(loading && !data) ? 'Chargement...' : 'Rafraîchir'}</span>
            </button>
          </div>
        </header>

        <main>
          {loading && !data && <Spinner />}
          {error && <ErrorMessage message={error} onRetry={fetchData} />}
          
          {data && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cardData.map(card => (
                   <DashboardCard 
                      key={card.key}
                      title={card.title} 
                      value={card.value} 
                      icon={card.icon}
                      color={card.color}
                    />
                ))}
              </div>

              <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg">
                <h2 className="text-lg font-semibold text-white mb-2">Ajouter un élève</h2>
                <p className="text-slate-400 text-sm mb-4">Choisissez le montant payé par l'élève.</p>
                <div className="flex flex-row gap-4">
                  <button
                    onClick={() => handleAddStudent(ADD_STUDENT_5E_URL)}
                    disabled={isAddingStudent}
                    className="flex-1 justify-center py-6 text-4xl bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 hover:border-indigo-500/80 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-indigo-200 font-extrabold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 disabled:transform-none disabled:shadow-none"
                  >
                    {isAddingStudent ? (
                      <span className="flex items-center justify-center text-base">
                        <SpinnerIcon /> Ajout...
                      </span>
                    ) : (
                      "5€"
                    )}
                  </button>
                  <button
                    onClick={() => handleAddStudent(ADD_STUDENT_7E_URL)}
                    disabled={isAddingStudent}
                    className="flex-1 justify-center py-6 text-4xl bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/50 hover:border-purple-500/80 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-purple-200 font-extrabold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 disabled:transform-none disabled:shadow-none"
                  >
                    {isAddingStudent ? (
                       <span className="flex items-center justify-center text-base">
                        <SpinnerIcon /> Ajout...
                      </span>
                    ) : (
                      "7€"
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {monthlySummary && <MonthlySummary data={monthlySummary} />}
                {dailyBreakdown && dailyBreakdown.length > 0 && <DailyBreakdown data={dailyBreakdown} />}
              </div>

            </>
          )}
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Copyright Aurélien Chardon</p>
        </footer>
      </div>
    </div>
  );
};

// --- SVG Icons ---

const SpinnerIcon: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CurrencyEuroIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 15.536A9.004 9.004 0 0112 16a9 9 0 115.879-15.879m-5.879 15.879l-5.88-5.88m5.88 5.88l-1.293-1.293m0 0a2.25 2.25 0 013.182 0l2.687 2.687a2.25 2.25 0 010 3.182l-1.293 1.293a2.25 2.25 0 01-3.182 0l-2.687-2.687a2.25 2.25 0 010-3.182z" />
  </svg>
);

const AcademicCapIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" />
  </svg>
);

const BeakerIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547a2 2 0 00-.547 1.806l.477 2.387a6 6 0 00.517 3.86l.158.318a6 6 0 003.86.517l2.387.477a2 2 0 001.806-.547a2 2 0 00.547-1.806l-.477-2.387a6 6 0 00-.517-3.86l-.158-.318a6 6 0 01-.517-3.86l.477-2.387a2 2 0 01.547-1.806z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.25l1.586-1.586a2 2 0 00-2.828-2.828l-1.586 1.586a2 2 0 002.828 2.828z" />
  </svg>
);

const UsersIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

interface RefreshIconProps {
  spinning: boolean;
}
const RefreshIcon: React.FC<RefreshIconProps> = ({ spinning }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 11v-5h-5m0 0l-1.293-1.293a2 2 0 00-2.828 0L4 20m16-16l-1.293 1.293a2 2 0 000 2.828l1.293 1.293M4 4h5v5m11 11h-5v-5m0 0l-1.293 1.293a2 2 0 01-2.828 0L4 4" />
  </svg>
);

export default App;
