import { api } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';

interface RecordItem { id:number; title:string; description:string; createdAt?:string }

const Records: React.FC = () => {
    const [records, setRecords] = useState<RecordItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [view, setView] = useState<'list'|'cards'>('cards');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const data = await api.get<RecordItem[]>('/records');
                setRecords(data);
            } catch (e:any) { setError(e.message); } finally { setLoading(false); }
        };
        fetchRecords();
    }, []);

    const filtered = records.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="content">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px'}}>
                <div>
                    <h1 style={{marginTop:0}}>Prontuários</h1>
                    <p className="muted" style={{marginTop:4}}>Registros clínicos detalhados por paciente.</p>
                </div>
                <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
                    <input
                        aria-label="Filtrar por título"
                        placeholder="Filtrar..."
                        value={query}
                        onChange={e=>setQuery(e.target.value)}
                        style={{padding:'8px 12px',border:'1px solid var(--color-border)',borderRadius:'var(--radius-md)'}}
                    />
                    <button className="btn" onClick={()=>setView(v=> v==='cards' ? 'list':'cards')}>
                        {view === 'cards' ? 'Tabela' : 'Cards'}
                    </button>
                    <button className="btn btn-primary">Novo</button>
                </div>
            </div>
                    {loading && <Card>Carregando...</Card>}
                    {error && <Card style={{borderColor:'var(--color-danger)'}}>{error}</Card>}
                    {!loading && !error && filtered.length === 0 && (
                        <Card><span className="muted">Nenhum prontuário encontrado.</span></Card>
                    )}
                    {!loading && !error && filtered.length > 0 && view === 'cards' && (
                        <div className="grid cols-3">
                            {filtered.map(r => (
                                <Card key={r.id} aria-label={`Prontuário ${r.title}`}>
                                    <h3 style={{margin:'0 0 4px'}}>{r.title}</h3>
                                    <p className="muted" style={{margin:0}}>{r.description}</p>
                                    <small className="muted">{r.createdAt ? new Date(r.createdAt).toLocaleDateString('pt-BR') : ''}</small>
                                </Card>
                            ))}
                        </div>
                    )}
                    {!loading && !error && filtered.length > 0 && view === 'list' && (
                        <Table
                            ariaLabel="Tabela de prontuários"
                            data={filtered}
                            columns={[
                                { header:'Título', accessor:'title' },
                                { header:'Descrição', accessor:'description' },
                                { header:'Criado', accessor:'createdAt', render: v => v ? new Date(v).toLocaleDateString('pt-BR') : '-' }
                            ]}
                        />
                    )}
        </div>
    );
};

export default Records;