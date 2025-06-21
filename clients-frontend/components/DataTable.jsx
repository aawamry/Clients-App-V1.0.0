import React from 'react';

function DataTable({ columns = [], data = [], actions, noDataMessage = 'No records found.', getRowClass }) {
	return (
		<div className="table-responsive">
			<table className="table table-sm table-bordered mb-0 text-nowrap">
				<thead className="table-light text-center">
					<tr>
						{columns.map((col) => (
							<th key={col.key}>{col.label}</th>
						))}
						{actions && <th>Actions</th>}
					</tr>
				</thead>
				<tbody>
					{data.length > 0 ? (
						data.map((row) => (
							<tr key={row.id} className={getRowClass ? getRowClass(row) : ''}>
								{columns.map((col) => (
									<td key={col.key}>
										{col.render ? col.render(row[col.key], row) : row[col.key]}
									</td>
								))}
								{actions && <td className="text-center">{actions(row)}</td>}
							</tr>
						))
					) : (
						<tr>
							<td colSpan={columns.length + (actions ? 1 : 0)} className="text-center text-muted py-3">
								{noDataMessage}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

export default DataTable;
