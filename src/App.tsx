import React, { useState, useEffect } from 'react';
import './App.css';
import { LeaveBalance, LeaveEntry } from './types';
import BalanceCard from './components/BalanceCard';
import TotalCard from './components/TotalCard';
import LeaveModal from './components/LeaveModal';
import LeaveReport from './components/LeaveReport';
import AuthButton from './components/AuthButton';
import { auth, db } from './firebase';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, getDocs, addDoc, deleteDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<LeaveBalance>({
    ferie: 0,
    rol: 0,
    exFestivita: 0
  });

  const [entries, setEntries] = useState<LeaveEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle redirect result from Google sign-in
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error('Errore durante il login:', error);
        alert('Errore durante il login: ' + error.message);
      });
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load data from Firestore when user logs in
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Clear data when logged out
      setBalance({ ferie: 0, rol: 0, exFestivita: 0 });
      setEntries([]);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load balance
      const balanceDoc = await getDoc(doc(db, 'users', user.uid, 'data', 'balance'));
      if (balanceDoc.exists()) {
        setBalance(balanceDoc.data() as LeaveBalance);
      }

      // Load entries
      const entriesQuery = query(collection(db, 'users', user.uid, 'entries'));
      const entriesSnapshot = await getDocs(entriesQuery);
      const loadedEntries = entriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as LeaveEntry[];
      setEntries(loadedEntries);
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
    }
  };

  // Save balance to Firestore
  const saveBalance = async (newBalance: LeaveBalance) => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid, 'data', 'balance'), newBalance);
    } catch (error) {
      console.error('Errore nel salvataggio del saldo:', error);
      alert('Errore nel salvataggio del saldo');
    }
  };

  const totalHours = balance.ferie + balance.rol + balance.exFestivita;
  const totalDays = totalHours / 8;

  const handleBalanceChange = (type: keyof LeaveBalance, value: number) => {
    const newBalance = {
      ...balance,
      [type]: value
    };
    setBalance(newBalance);
    saveBalance(newBalance);
  };

  const handleAddEntry = async (entry: Omit<LeaveEntry, 'id'>) => {
    if (!user) return;

    try {
      // Add entry to Firestore
      const docRef = await addDoc(collection(db, 'users', user.uid, 'entries'), entry);
      
      const newEntry: LeaveEntry = {
        ...entry,
        id: docRef.id
      };

      setEntries(prev => [...prev, newEntry]);
      
      // Update balance
      const newBalance = {
        ...balance,
        [entry.type]: balance[entry.type] - entry.hours
      };
      setBalance(newBalance);
      await saveBalance(newBalance);
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Errore nell\'aggiunta del permesso:', error);
      alert('Errore nell\'aggiunta del permesso');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (!user) return;

    const entry = entries.find(e => e.id === id);
    if (entry) {
      try {
        // Delete from Firestore
        await deleteDoc(doc(db, 'users', user.uid, 'entries', id));
        
        // Restore balance
        const newBalance = {
          ...balance,
          [entry.type]: balance[entry.type] + entry.hours
        };
        setBalance(newBalance);
        await saveBalance(newBalance);
        
        setEntries(prev => prev.filter(e => e.id !== id));
      } catch (error) {
        console.error('Errore nell\'eliminazione del permesso:', error);
        alert('Errore nell\'eliminazione del permesso');
      }
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestione Ferie e Permessi</h1>
        <AuthButton user={user} onAuthChange={loadUserData} />
      </header>
      
      {!user ? (
        <main className="App-main">
          <div className="welcome-message">
            <h2>Benvenuto!</h2>
            <p>Accedi con il tuo account Google per iniziare a gestire le tue ferie e permessi.</p>
          </div>
        </main>
      ) : (
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
      )}

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
