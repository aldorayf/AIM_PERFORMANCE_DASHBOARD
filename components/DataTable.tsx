import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  maxRows?: number;
}

export default function DataTable<T>({
  data,
  columns,
  title,
  maxRows,
}: DataTableProps<T>) {
  const displayData = maxRows ? data.slice(0, maxRows) : data;

  const getCellValue = (row: T, column: Column<T>): React.ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    const value = row[column.accessor];
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return String(value);
    return value as React.ReactNode;
  };

  return (
    <div className="bg-[#1a2332] rounded-lg border border-[#2d3748] overflow-hidden">
      {title && (
        <div className="px-6 py-4 border-b border-[#2d3748]">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2d3748] bg-[#0f1419]">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d3748]">
            {displayData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[#0f1419] transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.className || 'text-gray-300'
                    }`}
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
