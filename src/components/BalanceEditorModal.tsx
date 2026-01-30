import React, { useState } from 'react';
import { LeaveBalance } from '../types';

interface BalanceEditorModalProps {
  balance: LeaveBalance;
  onClose: () => void;
  onSave: (balance: LeaveBalance) => void;
}

const BalanceEditorModal: React.FC<BalanceEditorModalProps> = ({ balance, onClose, onSave }) => {
  const [editedBalance, setEditedBalance] = useState<LeaveBalance>(balance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedBalance);
    onClose();
  };

  const handleChange = (type: keyof LeaveBalance, value: number) => {
    setEditedBalance(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifica Saldi</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Saldo Ferie (ore)</label>
            <input 
              type="number"
              value={editedBalance.ferie}
              onChange={(e) => handleChange('ferie', Number(e.target.value))}
              min="0"
              step="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Saldo ROL (ore)</label>
            <input 
              type="number"
              value={editedBalance.rol}
              onChange={(e) => handleChange('rol', Number(e.target.value))}
              min="0"
              step="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Saldo Ex-Festività (ore)</label>
            <input 
              type="number"
              value={editedBalance.exFestivita}
              onChange={(e) => handleChange('exFestivita', Number(e.target.value))}
              min="0"
              step="1"
              required
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

export default BalanceEditorModal;
