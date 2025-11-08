import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary';
};

const Button: React.FC<ButtonProps> = ({ variant = 'default', className = '', children, ...rest }) => {
  const base = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary' : '';
  return (
    <button className={`${base} ${variantClass} ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
};

export default Button;
