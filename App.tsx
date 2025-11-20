
import React, { useState, useEffect, useCallback } from 'react';
import { WebhookData, MonthlySummaryData, DailyBreakdownEntry } from './types';
import DashboardCard from './components/DashboardCard';
import Spinner from './components/Spinner';
import ErrorMessage from './components/ErrorMessage';
import MonthlySummary from './components/MonthlySummary';
import DailyBreakdown from './components/DailyBreakdown';
import { AcademicCapIcon, BeakerIcon, CurrencyEuroIcon, RefreshIcon, SpinnerIcon, UsersIcon } from './components/icons';

const WEBHOOK_URL = 'https://workflow.aurelienchardon.com/webhook/nbeleve';
const ADD_STUDENT_5E_URL = 'https://workflow.aurelienchardon.com/webhook/eleve5e';
const ADD_STUDENT_7E_URL = 'https://workflow.aurelienchardon.com/webhook/eleve7e';
const CANCEL_ADD_STUDENT_URL = 'https://workflow.aurelienchardon.com/webhook/annulerajouteleve';

const App: React.FC = () => {
  const [data, setData] = useState<WebhookData | null>(null);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummaryData | null>(null);
  const [dailyBreakdown, setDailyBreakdown] = useState<DailyBreakdownEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [actionInProgress, setActionInProgress] = useState<'add' | 'cancel' | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
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
  }, []);

  useEffect(() => {
    fetchData();
    // Suppression du setInterval pour éviter les appels automatiques et les boucles infinies
  }, [fetchData]);

  const handleAddStudent = async (url: string) => {
    setActionInProgress('add');
    setError(null);
    try {
      const response = await fetch(url, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Le serveur a répondu avec le statut ${response.status}`);
      }
      // Success, refetch data
      setTimeout(fetchData, 500);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Action impossible : ${err.message}`);
      } else {
        setError("Une erreur inconnue est survenue lors de l'action.");
      }
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCancelStudent = async () => {
    setActionInProgress('cancel');
    setError(null);
    try {
      const response = await fetch(CANCEL_ADD_STUDENT_URL, { method: 'GET' });
      if (!response.ok) {
        throw new Error(`Le serveur a répondu avec le statut ${response.status}`);
      }
       // Success, refetch data
      setTimeout(fetchData, 500);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Impossible d'annuler : ${err.message}`);
      } else {
        setError("Une erreur inconnue est survenue lors de l'annulation.");
      }
    } finally {
      setActionInProgress(null);
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
              disabled={loading || !!actionInProgress}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <RefreshIcon spinning={loading && !!data} />
              <span className="hidden sm:inline">{(loading && !data) ? 'Chargement...' : 'Rafraîchir'}</span>
            </button>
          </div>
        </header>

        <main>
          {loading && !data && <Spinner />}
          {error && <ErrorMessage message={error} onRetry={actionInProgress === 'cancel' ? handleCancelStudent : fetchData} />}
          
          {data && !error && (
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
                    disabled={!!actionInProgress}
                    className="flex-1 justify-center py-6 text-4xl bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/50 hover:border-indigo-500/80 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-indigo-200 font-extrabold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 disabled:transform-none disabled:shadow-none"
                  >
                    {actionInProgress === 'add' ? (
                      <span className="flex items-center justify-center text-base">
                        <SpinnerIcon /> Ajout...
                      </span>
                    ) : (
                      "5€"
                    )}
                  </button>
                  <button
                    onClick={() => handleAddStudent(ADD_STUDENT_7E_URL)}
                    disabled={!!actionInProgress}
                    className="flex-1 justify-center py-6 text-4xl bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/50 hover:border-purple-500/80 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-purple-200 font-extrabold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 disabled:transform-none disabled:shadow-none"
                  >
                    {actionInProgress === 'add' ? (
                       <span className="flex items-center justify-center text-base">
                        <SpinnerIcon /> Ajout...
                      </span>
                    ) : (
                      "7€"
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center mt-2">
                <button
                  onClick={handleCancelStudent}
                  disabled={!!actionInProgress}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 rounded-md hover:bg-slate-700/50 hover:text-red-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label="Annuler le dernier ajout"
                >
                  {actionInProgress === 'cancel' ? (
                    <>
                      <SpinnerIcon className="animate-spin h-4 w-4" />
                      <span>Annulation...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Annuler le dernier ajout</span>
                    </>
                  )}
                </button>
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

export default App;
