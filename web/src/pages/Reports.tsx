import React, { useEffect, useState } from 'react';
import Table from '../components/ui/Table';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Report { id:number; title:string; content?:string; createdAt?:string }

const Reports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch('/api/reports');
                if (!res.ok) throw new Error('Falha ao carregar relatórios');
                const data = await res.json();
                setReports(data);
            } catch (e:any) {
                setError(e.message);
            } finally { setLoading(false); }
        };
        fetchReports();
    }, []);

    const filtered = reports.filter(r => r.title.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div className="content">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
                <div>
                    <h1 style={{marginTop:0}}>Relatórios</h1>
                    <p className="muted" style={{marginTop:4}}>Documentos clínicos e evoluções registrados.</p>
                </div>
                <div style={{display:'flex',gap:'8px'}}>
                    <input
                        aria-label="Filtrar por título"
                        placeholder="Filtrar..."
                        value={filter}
                        onChange={e=>setFilter(e.target.value)}
                        style={{padding:'8px 12px',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)'}}
                    />
                    <button className="btn btn-primary">Novo</button>
                </div>
            </div>

                    {loading && <Card>Carregando...</Card>}
                    {error && <Card style={{borderColor:'var(--color-danger)'}}>{error}</Card>}
                    {!loading && !error && (
                        <Table
                            ariaLabel="Tabela de relatórios"
                            data={filtered}
                            emptyMessage="Nenhum relatório encontrado."
                            columns={[
                                { header: 'Título', accessor: 'title' },
                                { header: 'Criado', accessor: 'createdAt', render: v => v ? new Date(v).toLocaleDateString('pt-BR') : '-' }
                            ]}
                        />
                    )}
        </div>
    );
};

export default Reports;