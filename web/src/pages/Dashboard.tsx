import React from 'react';
import Stat from '../components/ui/Stat';
import Card from '../components/ui/Card';

const stats = [
    { label: 'Relatórios', value: 12 },
    { label: 'Prontuários', value: 34 },
    { label: 'Profissionais', value: 5 },
    { label: 'Pacientes Ativos', value: 18 }
];

const Dashboard: React.FC = () => {
    return (
        <div className="content">
            <div>
                <h1 style={{marginTop:0}}>📊 Visão Geral</h1>
                <p className="muted">Acompanhe os indicadores principais da sua prática ABA.</p>
            </div>
            <section className="grid cols-3">
                {stats.map(s => (
                    <Stat key={s.label} label={s.label} value={s.value} />
                ))}
            </section>
            <Card title="Atividades Recentes">
                <ul style={{margin:0,paddingLeft:'16px'}}>
                    <li>Novo relatório adicionado para paciente João.</li>
                    <li>Registro de sessão ABA atualizado.</li>
                    <li>Prontuário revisado por supervisor clínico.</li>
                </ul>
            </Card>
        </div>
    );
};

export default Dashboard;