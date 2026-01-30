import React, { useState } from 'react';
import { LeaveEntry } from '../types';

interface LeaveReportProps {
  entries: LeaveEntry[];
  onDelete: (id: string) => void;
}

const LeaveReport: React.FC<LeaveReportProps> = ({ entries, onDelete }) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedEntries = [...entries].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'ferie': return 'Ferie';
      case 'rol': return 'ROL';
      case 'exFestivita': return 'Ex-Festività';
      default: return type;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (entries.length === 0) {
    return (
      <div className="report-section">
        <h2>Report Permessi</h2>
        <p className="empty-message">Nessun permesso registrato</p>
      </div>
    );
  }

  return (
    <div className="report-section">
      <h2>Report Permessi</h2>
      
      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th onClick={toggleSortOrder} className="sortable">
                Data {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
              <th>Tipo</th>
              <th>Ore</th>
              <th>Descrizione</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{formatDate(entry.date)}</td>
                <td>{getTypeLabel(entry.type)}</td>
                <td>{entry.hours} ore</td>
                <td>{entry.description || '-'}</td>
                <td>
                  <button 
                    className="btn-delete"
                    onClick={() => {
                      if (window.confirm('Sei sicuro di voler eliminare questo permesso?')) {
                        onDelete(entry.id);
                      }
                    }}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveReport;
