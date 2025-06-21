import { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import { getAllLogs } from '../services/logsService';
import Pagination from '../components/Pagination';

function LogsPage() {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 50;

	useEffect(() => {
		async function fetchLogs() {
			try {
				const data = await getAllLogs();
				setLogs(data);
			} catch (err) {
				console.error('Error fetching logs:', err);
				setError('Failed to load logs');
			} finally {
				setLoading(false);
			}
		}
		fetchLogs();
	}, []);

	if (loading) return <p>Loading logs...</p>;
	if (error) return <p className="text-danger">{error}</p>;

	const filteredLogs = logs; // Placeholder for future filtering
	const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
	const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const columns = [
		{ key: 'id', label: 'ID' },
		{
			key: 'created_at',
			label: 'Timestamp',
			render: (value) => new Date(value).toLocaleString(),
		},
		{ key: 'type', label: 'Type' },
		{ key: 'subject', label: 'Subject' },
		{ key: 'message', label: 'Message' },
	];

	return (
		<div className="container mt-4">
			<h2 className="mb-4 text-primary">Event Logs</h2>
			<DataTable
				columns={columns}
				data={paginatedLogs}
				getRowClass={(row) =>
					row.type === 'ERROR' ? 'table-danger' :
					row.type === 'WARNING' ? 'table-warning' :
					''
				}
			/>
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}

export default LogsPage;
