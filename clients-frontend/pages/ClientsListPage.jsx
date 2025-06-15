import { useEffect, useState } from 'react'; // React hooks for state and side effects
import { getClients } from '../services/clientService'; // Function to fetch client list from backend
import { Link } from 'react-router-dom'; // For navigation links

function ClientsListPage() {
	const [clients, setClients] = useState([]); // Holds array of clients
	const [loading, setLoading] = useState(true); // Tracks loading state
	const [error, setError] = useState(''); // Holds error message if fetch fails

	useEffect(() => {
		async function fetchClients() {
			try {
				const data = await getClients(); // Fetches clients from API
				setClients(data); // Stores fetched clients in state
			} catch (err) {
				setError('Failed to load clients'); // Sets error message
				console.error(err); // Logs error
			} finally {
				setLoading(false); // Hides loading indicator
			}
		}
		fetchClients(); // Call on component mount
	}, []);

	if (loading) return <p>Loading clients...</p>; // Show while loading
	if (error) return <p className="text-danger">{error}</p>; // Show if there's an error

	return (
		<div className="container-fluid mt-4">
			<div className="row">
				<div className="col-12">
					<div className="d-flex justify-content-between align-items-center mb-4">
						<h2 className="text-primary">Clients List</h2>
						<Link to="/clients/add" className="btn btn-success">
							Add Client
						</Link>
					</div>

					{clients.length === 0 ? (
						<p>No clients found.</p>
					) : (
						<div className="table-responsive">
							<table className="table table-bordered table-hover">
								<thead className="table-light">
									<tr>
										<th>ID</th>
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
											<td>{client.id}</td>
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
											<td>
												<Link to={`/clients/edit/${client.id}`} className="btn btn-sm btn-primary me-2">
													Edit
												</Link>
												{/* Optional delete button */}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default ClientsListPage;
