import React, { useState } from 'react';
import { LeaveEntry } from '../types';

interface LeaveModalProps {
  onClose: () => void;
  onSubmit: (entry: Omit<LeaveEntry, 'id'>) => void;
}

const LeaveModal: React.FC<LeaveModalProps> = ({ onClose, onSubmit }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'ferie' | 'rol' | 'exFestivita'>('ferie');
  const [hours, setHours] = useState<number>(8);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || hours <= 0) {
      alert('Per favore compila tutti i campi richiesti');
      return;
    }

    onSubmit({
      date,
      type,
      hours,
      description: description.trim() || undefined
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Aggiungi Permesso/Ferie</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Data</label>
            <input 
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as 'ferie' | 'rol' | 'exFestivita')}
            >
              <option value="ferie">Ferie</option>
              <option value="rol">ROL</option>
              <option value="exFestivita">Ex-Festività</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ore</label>
            <input 
              type="number"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              min="0.5"
              step="0.5"
              required
            />
          </div>

          <div className="form-group">
            <label>Descrizione (opzionale)</label>
            <input 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Es. Ferie estive"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Annulla
            </button>
            <button type="submit" className="btn-primary">
              Salva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveModal;
