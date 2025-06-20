import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Papa from 'papaparse';
import { getAllClients, deleteClient } from '../services/clientService';
import 'bootstrap-icons/font/bootstrap-icons.css';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';

function ClientsListPage() {
	const [clients, setClients] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [file, setFile] = useState(null);
	const navigate = useNavigate();

	const columns = [
		{ label: 'ID', key: 'id' },
		{ label: 'First Name', key: 'firstName' },
		{ label: 'Middle Name', key: 'middleName' },
		{ label: 'Last Name', key: 'lastName' },
		{ label: 'Company', key: 'companyName' },
		{ label: 'Address', key: 'address' },
		{ label: 'Region', key: 'region' },
		{ label: 'City', key: 'city' },
		{ label: 'Nationality', key: 'nationality' },
		{ label: 'DOB', key: 'dateOfBirth' },
		{ label: 'Gender', key: 'gender' },
		{ label: 'Phone', key: 'phone' },
		{ label: 'Email', key: 'email' },
		{ label: 'Created At', key: 'created_at' }
	];

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const data = await getAllClients();
				setClients(data);
			} catch (err) {
				console.error('Failed to load clients:', err);
				toast.error('Error loading clients');
			}
		};
		fetchClients();
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);
	if (!Array.isArray(clients)) return <p>Loading or no data available</p>;
	const filteredClients = clients.filter((client) => {
		const target = `${client.firstName} ${client.lastName} ${client.companyName} ${client.email}`.toLowerCase();
		return target.includes(searchTerm.toLowerCase());
	});

	const itemsPerPage = 5;
	const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
	const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const handleDelete = async (id) => {
		if (!window.confirm('Are you sure you want to delete this client?')) return;
		try {
			await deleteClient(id);
			toast.success('Client deleted');
			setClients((prev) => prev.filter((client) => client.id !== id));
		} catch (err) {
			console.error('Delete failed:', err);
			toast.error('Failed to delete client');
		}
	};

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (!selectedFile) return;

		if (!selectedFile.name.endsWith('.csv')) {
			toast.error('Please upload a valid .csv file.');
			return;
		}
		setFile(selectedFile);
	};

	const handleUpload = async (event) => {
		event.preventDefault();

		if (!file) return toast.warning('Please select a CSV file first.');

		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: async function (results) {
				const csvData = results.data;

				// ✅ Log CSV output here
				console.log('Parsed CSV data:', csvData);

				try {
					const response = await axios.post(
						'http://localhost:3000/api/clients/import-csv',
						{ data: csvData },
						{ headers: { 'Content-Type': 'application/json' } }
					);
					toast.success(response.data?.message || 'Clients imported successfully');
				} catch (err) {
					console.error('Import failed:', err);
					toast.error('Failed to import clients');
				}
			}
		});
	};

	return (
		<div className="container-fluid mt-4">
			<div className="card shadow-sm">
				<div className="card-header bg-light d-flex flex-wrap justify-content-between align-items-center py-3">
					<h5 className="mb-2 mb-md-0 text-primary">📋 Clients List</h5>

					<div className="d-flex flex-wrap gap-2">
						<button className="btn btn-outline-primary btn-sm" onClick={() => navigate('/clients/add')}>
							+ Add Client
						</button>

						<a
							href="http://localhost:3000/api/clients/export-csv"
							className="btn btn-outline-success btn-sm"
							download="clients.csv"
						>
							⬇️ Export CSV
						</a>

						<form className="d-flex gap-2 align-items-center" onSubmit={handleUpload}>
							<input
								type="file"
								accept=".csv"
								onChange={handleFileChange}
								className="form-control form-control-sm"
								style={{ maxWidth: '180px' }}
							/>
							<button className="btn btn-primary btn-sm" type="submit" disabled={!file}>
								⬆️ Import CSV
							</button>
						</form>
					</div>
				</div>

				<div className="card-body">
					<input
						type="text"
						className="form-control mb-3"
						placeholder="🔍 Search by name, company, or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>

					{paginatedClients.length === 0 ? (
						<p className="text-center text-muted py-4">No clients match your search.</p>
					) : (
						<DataTable
							columns={columns}
							data={paginatedClients}
							actions={(client) => (
								<>
									<button
										className="btn btn-sm btn-outline-success me-1"
										title="View"
										onClick={() => navigate(`/clients/view/${client.id}`)}
									>
										<i className="bi bi-eye"></i>
									</button>
									<button
										className="btn btn-sm btn-outline-warning me-1"
										title="Edit"
										onClick={() => navigate(`/clients/edit/${client.id}`)}
									>
										<i className="bi bi-pencil"></i>
									</button>
									<button
										className="btn btn-sm btn-outline-danger"
										title="Delete"
										onClick={() => handleDelete(client.id)}
									>
										<i className="bi bi-trash"></i>
									</button>
								</>
							)}
						/>
					)}

					<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
				</div>
			</div>
		</div>
	);
}

export default ClientsListPage;
