import React from 'react';
import { Table as BootstrapTable } from 'react-bootstrap';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <BootstrapTable striped bordered hover responsive>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </BootstrapTable>
  );
};

interface TableRowProps {
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return <tr>{children}</tr>;
};

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  className = '' 
}) => {
  return <td className={className}>{children}</td>;
};
