import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getClientById, deleteClient } from '../services/clientService';

function ViewClientPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [client, setClient] = useState(null);

	useEffect(() => {
		async function fetchClient() {
			try {
				const data = await getClientById(id);
				setClient(data);
			} catch (error) {
				console.error('Failed to fetch client:', error);
			}
		}
		fetchClient();
	}, [id]);

	const handleDelete = async () => {
		if (confirm('Are you sure you want to delete this client?')) {
			try {
				await deleteClient(id);
				navigate('/clients');
			} catch (error) {
				console.error('Failed to delete client:', error);
			}
		}
	};

	if (!client) return <p>Loading client data...</p>;

	return (
		<div className="container mt-4">
			<h4 className="text-primary mb-4">Client Details</h4>

			<div className="card shadow-sm">
				<div className="card-body">
					<table className="table table-sm table-bordered">
						<tbody>
							<tr>
								<th>First Name</th>
								<td>{client.firstName}</td>
								<th>Middle Name</th>
								<td>{client.middleName || <em>—</em>}</td>
							</tr>
							<tr>
								<th>Last Name</th>
								<td>{client.lastName}</td>
								<th>Company Name</th>
								<td>{client.companyName}</td>
							</tr>
							<tr>
								<th>Address</th>
								<td>{client.address}</td>
								<th>Region</th>
								<td>{client.region}</td>
							</tr>
							<tr>
								<th>City</th>
								<td>{client.city}</td>
								<th>Nationality</th>
								<td>{client.nationality}</td>
							</tr>
							<tr>
								<th>Date of Birth</th>
								<td>{client.dateOfBirth}</td>
								<th>Gender</th>
								<td>{client.gender}</td>
							</tr>
							<tr>
								<th>Phone</th>
								<td>{client.phone}</td>
								<th>Email</th>
								<td>{client.email}</td>
							</tr>
						</tbody>
					</table>

					<div className="mt-3 d-flex justify-content-end gap-2">
						<button
							className="btn btn-outline-warning btn-sm"
							onClick={() => navigate(`/clients/edit/${id}`)}
							title="Edit"
						>
							✎ Edit
						</button>
						<button className="btn btn-outline-danger btn-sm" onClick={handleDelete} title="Delete">
							× Delete
						</button>
						<button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/clients')} title="Back">
							← Back
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ViewClientPage;
