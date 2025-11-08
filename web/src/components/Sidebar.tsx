import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <aside className="sidebar" aria-label="Navegação principal">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h2 style={{margin:0}}>{collapsed ? 'Menu' : 'Menu Principal'}</h2>
                <button
                    className="btn"
                    onClick={() => setCollapsed(c => !c)}
                    aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
                >{collapsed ? '▶' : '◀'}</button>
            </div>
            <ul className="nav-list" style={{marginTop:'8px'}}>
                <li>
                    <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''}>Relatórios</NavLink>
                </li>
                <li>
                    <NavLink to="/records" className={({isActive}) => isActive ? 'active' : ''}>Prontuários</NavLink>
                </li>
            </ul>
        </aside>
    );
};

export default Sidebar;