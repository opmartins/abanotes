import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  actions?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ title, actions, children, className = '', ...rest }) => {
  return (
    <div className={`card ${className}`.trim()} {...rest}>
      {(title || actions) && (
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
          {title && <h3 style={{margin:0}}>{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
