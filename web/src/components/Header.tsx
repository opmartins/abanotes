import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

interface HeaderProps {
  user?: { name: string; email: string; role: string } | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="site-header" role="banner">
            <Logo size="medium" showText={true} />
            <nav aria-label="Navegação principal">
                <ul className="nav-list" style={{flexDirection:'row'}}>
                    <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>📊 Dashboard</NavLink></li>
                    <li><NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''}>📈 Relatórios</NavLink></li>
                    <li><NavLink to="/records" className={({isActive}) => isActive ? 'active' : ''}>📋 Prontuários</NavLink></li>
                    {user?.role === 'ADMIN' && (
                        <li><NavLink to="/users" className={({isActive}) => isActive ? 'active' : ''}>👥 Usuários</NavLink></li>
                    )}
                </ul>
            </nav>
            <div className="header-actions">
                <div style={{ position: 'relative' }}>
                    <button 
                        className="btn btn-primary" 
                        aria-label="Perfil do usuário"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        {user?.role === 'ADMIN' ? '👑' : '👤'} {user?.name}
                    </button>
                    {showMenu && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: '100%',
                            marginTop: '8px',
                            background: 'white',
                            border: '1px solid var(--color-border)',
                            borderRadius: '10px',
                            boxShadow: 'var(--shadow-lg)',
                            minWidth: '200px',
                            zIndex: 1000
                        }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
                                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{user?.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user?.email}</div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowMenu(false);
                                    onLogout?.();
                                }}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: 'none',
                                    background: 'transparent',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    color: '#EF4444',
                                    fontWeight: 500
                                }}
                            >
                                � Sair
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;