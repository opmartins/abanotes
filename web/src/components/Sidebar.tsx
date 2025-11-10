import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';

const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);
    
    return (
        <aside className="sidebar" aria-label="Navegação principal">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <Logo size="small" showText={!collapsed} />
                <button
                    className="btn"
                    onClick={() => setCollapsed(c => !c)}
                    aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
                    style={{padding: '8px'}}
                >{collapsed ? '▶' : '◀'}</button>
            </div>
            
            <div style={{marginTop: '24px'}}>
                <h2 style={{margin: '0 0 12px 0', fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600}}>
                    {collapsed ? '📊' : 'Principal'}
                </h2>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
                            <span>📊</span> {!collapsed && 'Dashboard'}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''}>
                            <span>📈</span> {!collapsed && 'Relatórios'}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/records" className={({isActive}) => isActive ? 'active' : ''}>
                            <span>📋</span> {!collapsed && 'Prontuários'}
                        </NavLink>
                    </li>
                    {user?.role === 'ADMIN' && (
                        <li>
                            <NavLink to="/users" className={({isActive}) => isActive ? 'active' : ''}>
                                <span>👥</span> {!collapsed && 'Usuários'}
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>
            
            {!collapsed && (
                <div style={{marginTop: 'auto', padding: '16px', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)'}}>
                    <p style={{margin: 0, fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: 500}}>
                        💡 Dica do dia
                    </p>
                    <p style={{margin: '8px 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.4}}>
                        Mantenha seus registros sempre atualizados para melhor acompanhamento.
                    </p>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;