import React from 'react';

interface TotalCardProps {
  label: string;
  value: number;
  unit: string;
}

const TotalCard: React.FC<TotalCardProps> = ({ label, value, unit }) => {
  return (
    <div className="total-card">
      <label>{label}</label>
      <div className="total-value">
        {value.toFixed(2)} {unit}
      </div>
    </div>
  );
};

export default TotalCard;
