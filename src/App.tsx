import React, { useState, useEffect } from 'react';
import './App.css';
import { LeaveBalance, LeaveEntry } from './types';
import BalanceCard from './components/BalanceCard';
import TotalCard from './components/TotalCard';
import LeaveModal from './components/LeaveModal';
import LeaveReport from './components/LeaveReport';

function App() {
  const [balance, setBalance] = useState<LeaveBalance>({
    ferie: 0,
    rol: 0,
    exFestivita: 0
  });

  const [entries, setEntries] = useState<LeaveEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBalance = localStorage.getItem('leaveBalance');
    const savedEntries = localStorage.getItem('leaveEntries');
    
    if (savedBalance) {
      setBalance(JSON.parse(savedBalance));
    }
    
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('leaveBalance', JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('leaveEntries', JSON.stringify(entries));
  }, [entries]);

  const totalHours = balance.ferie + balance.rol + balance.exFestivita;
  const totalDays = totalHours / 8;

  const handleBalanceChange = (type: keyof LeaveBalance, value: number) => {
    setBalance(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleAddEntry = (entry: Omit<LeaveEntry, 'id'>) => {
    const newEntry: LeaveEntry = {
      ...entry,
      id: Date.now().toString()
    };

    setEntries(prev => [...prev, newEntry]);
    
    // Update balance
    setBalance(prev => ({
      ...prev,
      [entry.type]: prev[entry.type] - entry.hours
    }));
    
    setIsModalOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      // Restore balance
      setBalance(prev => ({
        ...prev,
        [entry.type]: prev[entry.type] + entry.hours
      }));
      
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestione Ferie e Permessi</h1>
      </header>
      
      <main className="App-main">
        <div className="balance-section">
          <BalanceCard 
            label="Saldo Ferie"
            value={balance.ferie}
            onChange={(value) => handleBalanceChange('ferie', value)}
          />
          <BalanceCard 
            label="Saldo ROL"
            value={balance.rol}
            onChange={(value) => handleBalanceChange('rol', value)}
          />
          <BalanceCard 
            label="Saldo Ex-Festività"
            value={balance.exFestivita}
            onChange={(value) => handleBalanceChange('exFestivita', value)}
          />
        </div>

        <div className="total-section">
          <TotalCard 
            label="Totale Ore"
            value={totalHours}
            unit="ore"
          />
          <TotalCard 
            label="Totale Giorni"
            value={totalDays}
            unit="giorni"
          />
        </div>

        <div className="action-section">
          <button 
            className="btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            Aggiungi Permesso/Ferie
          </button>
        </div>

        <LeaveReport 
          entries={entries}
          onDelete={handleDeleteEntry}
        />
      </main>

      {isModalOpen && (
        <LeaveModal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddEntry}
        />
      )}
    </div>
  );
}

export default App;
