import React from 'react';
import { LeaveBalance } from '../types';

interface BalanceViewCardProps {
  balance: LeaveBalance;
  onEdit: () => void;
}

const BalanceViewCard: React.FC<BalanceViewCardProps> = ({ balance, onEdit }) => {
  return (
    <div className="balance-view-container">
      <div className="balance-view-header">
        <h2>Saldi Disponibili</h2>
        <button className="btn-edit" onClick={onEdit}>
          ✏️ Modifica
        </button>
      </div>
      
      <div className="balance-view-grid">
        <div className="balance-view-item">
          <span className="balance-view-label">Ferie</span>
          <span className="balance-view-value">{balance.ferie} ore</span>
        </div>
        
        <div className="balance-view-item">
          <span className="balance-view-label">ROL</span>
          <span className="balance-view-value">{balance.rol} ore</span>
        </div>
        
        <div className="balance-view-item">
          <span className="balance-view-label">Ex-Festività</span>
          <span className="balance-view-value">{balance.exFestivita} ore</span>
        </div>
      </div>
    </div>
  );
};

export default BalanceViewCard;
