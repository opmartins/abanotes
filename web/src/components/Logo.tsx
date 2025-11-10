import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const sizes = {
    small: { icon: '20px', text: '0.875rem' },
    medium: { icon: '32px', text: '1.125rem' },
    large: { icon: '48px', text: '1.5rem' }
  };

  const currentSize = sizes[size];

  return (
    <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div 
        className="logo-icon"
        style={{
          width: currentSize.icon,
          height: currentSize.icon,
          background: 'linear-gradient(135deg, #4F46E5, #14B8A6)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size === 'small' ? '12px' : size === 'medium' ? '18px' : '24px',
          boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
        }}
      >
        📝
      </div>
      {showText && (
        <div 
          className="logo-text"
          style={{
            fontSize: currentSize.text,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #4F46E5, #14B8A6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em'
          }}
        >
          ABA Notes
        </div>
      )}
    </div>
  );
};

export default Logo;
