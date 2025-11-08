import React from 'react';

type Column<T> = {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string | number;
};

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  ariaLabel?: string;
}

function Table<T extends { id: number | string }>({ columns, data, emptyMessage='Nenhum dado.', ariaLabel }: TableProps<T>) {
  return (
    <div className="card" style={{padding:0}}>
      <table className="data-table" aria-label={ariaLabel}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.accessor)} style={col.width ? {width:col.width} : undefined}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length}><span className="muted">{emptyMessage}</span></td>
            </tr>
          )}
          {data.map(row => (
            <tr key={row.id}>
              {columns.map(col => {
                const raw = row[col.accessor];
                return (
                  <td key={String(col.accessor)}>{col.render ? col.render(raw, row) : String(raw)}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
