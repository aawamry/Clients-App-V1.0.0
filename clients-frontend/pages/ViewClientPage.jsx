import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClientById, deleteClient } from "../services/clientService";
import { toast } from "react-toastify";

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
				console.error("Failed to fetch client:", error);
			}
		}
		fetchClient();
	}, [id]);

	const handleDelete = async () => {
		if (confirm("Are you sure you want to delete this client?")) {
			try {
				await deleteClient(id);
				navigate("/clients");
				toast.success("Client deleted");
			} catch (error) {
				console.error("Failed to delete client:", error);
				toast.error("Failed to delete client");
			}
		}
	};

	if (!client) return <p>Loading client data...</p>;

	// Define fields to render dynamically
	const fields = [
		{ label: "First Name", key: "firstName" },
		{ label: "Middle Name", key: "middleName" },
		{ label: "Last Name", key: "lastName" },
		{ label: "Company Name", key: "companyName" },
		{ label: "Address", key: "address" },
		{ label: "Region", key: "region" },
		{ label: "City", key: "city" },
		{ label: "Nationality", key: "nationality" },
		{ label: "Date of Birth", key: "dateOfBirth" },
		{ label: "Gender", key: "gender" },
		{ label: "Phone", key: "phone" },
		{ label: "Email", key: "email" },
	];

	// Split into pairs of two fields per row
	const rows = [];
	for (let i = 0; i < fields.length; i += 2) {
		rows.push(fields.slice(i, i + 2));
	}

	return (
		<div className="container mt-4">
			<h4 className="text-primary mb-4">Client Details</h4>

			<div className="card shadow-sm">
				<div className="card-body">
					<table className="table table-sm table-bordered">
						<tbody>
							{rows.map((pair, index) => (
								<tr key={index}>
									{pair.map((field) => (
										<>
											<th key={`${field.key}-label`}>{field.label}</th>
											<td key={`${field.key}-value`}>
												{client[field.key] || <em>—</em>}
											</td>
										</>
									))}
									{/* If there was only one field in the last row, fill the other cells */}
									{pair.length < 2 && (
										<>
											<th></th>
											<td></td>
										</>
									)}
								</tr>
							))}
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
						<button
							className="btn btn-outline-danger btn-sm"
							onClick={handleDelete}
							title="Delete"
						>
							× Delete
						</button>
						<button
							className="btn btn-outline-secondary btn-sm"
							onClick={() => navigate("/clients")}
							title="Back"
						>
							← Back
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ViewClientPage;
