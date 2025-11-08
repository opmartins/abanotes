import React from 'react';

type StatProps = {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
};

const Stat: React.FC<StatProps> = ({ label, value, accent }) => {
  return (
    <div className="card stat" aria-label={label}>
      <span className="stat-value" style={accent ? {color:'var(--color-accent)'} : undefined}>{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default Stat;
