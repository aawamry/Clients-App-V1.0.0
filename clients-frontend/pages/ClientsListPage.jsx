import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClients, deleteClient } from '../services/clientService';
import { toast } from 'react-toastify';
import 'bootstrap-icons/font/bootstrap-icons.css';

function ClientsListPage() {
	const [clients, setClients] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchClients = async () => {
			try {
				const data = await getAllClients();
				setClients(data);
			} catch (err) {
				console.error('Failed to load clients:', err);
			}
		};
		fetchClients();
	}, []);

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

	return (
		<div className="container-fluid mt-4">
			<div className="card">
				<div className="card-header bg-gray text-primary d-flex justify-content-between align-items-center">
					<h5 className="mb-0">Clients List</h5>
					<button className="btn btn-light btn-sm" onClick={() => navigate('/clients/add')}>
						+ Add Client
					</button>
				</div>

				<div className="card-body p-0">
					<div className="table-responsive">
						<table className="table table-sm table-bordered mb-0 text-nowrap">
							<thead className="table-light text-center">
								<tr>
									<th>First Name</th>
									<th>Middle Name</th>
									<th>Last Name</th>
									<th>Company</th>
									<th>Address</th>
									<th>Region</th>
									<th>City</th>
									<th>Nationality</th>
									<th>DOB</th>
									<th>Gender</th>
									<th>Phone</th>
									<th>Email</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{clients.map((client) => (
									<tr key={client.id}>
										<td>{client.firstName}</td>
										<td>{client.middleName}</td>
										<td>{client.lastName}</td>
										<td>{client.companyName}</td>
										<td>{client.address}</td>
										<td>{client.region}</td>
										<td>{client.city}</td>
										<td>{client.nationality}</td>
										<td>{client.dateOfBirth}</td>
										<td>{client.gender}</td>
										<td>{client.phone}</td>
										<td>{client.email}</td>
										<td className="text-center">
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
										</td>
									</tr>
								))}
								{clients.length === 0 && (
									<tr>
										<td colSpan="13" className="text-center text-muted py-3">
											No clients found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ClientsListPage;
