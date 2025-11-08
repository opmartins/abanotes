import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="site-header" role="banner">
            <div className="brand" aria-label="Marca da clínica">
                <span className="brand-logo" aria-hidden="true" />
                <span>Clínica ABA Cuidar</span>
            </div>
            <nav aria-label="Atalhos">
                <ul className="nav-list" style={{flexDirection:'row'}}>
                    <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
                    <li><NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''}>Relatórios</NavLink></li>
                    <li><NavLink to="/records" className={({isActive}) => isActive ? 'active' : ''}>Prontuários</NavLink></li>
                </ul>
            </nav>
            <div className="header-actions">
                <button className="btn" aria-label="Alternar tema">Tema</button>
                <button className="btn" aria-label="Perfil do usuário">Usuário</button>
            </div>
        </header>
    );
};

export default Header;