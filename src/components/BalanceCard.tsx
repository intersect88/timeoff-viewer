import React from 'react';

interface BalanceCardProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ label, value, onChange }) => {
  return (
    <div className="balance-card">
      <label>{label}</label>
      <input 
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min="0"
        step="0.5"
      />
      <span className="unit">ore</span>
    </div>
  );
};

export default BalanceCard;
