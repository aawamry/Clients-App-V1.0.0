import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClientById, updateClient } from '../services/clientService';
import { toast } from 'react-toastify';

function EditClientPage() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		firstName: '',
		middleName: '',
		lastName: '',
		companyName: '',
		address: '',
		region: '',
		city: '',
		nationality: '',
		dateOfBirth: '',
		gender: '',
		phone: '',
		email: ''
	});

	const [loading, setLoading] = useState(true);
	const [formErrors, setFormErrors] = useState([]);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchClient() {
			try {
				const client = await getClientById(id);
				console.log('✅ Full response:', client);
				setFormData({
					firstName: client.firstName || '',
					middleName: client.middleName || '',
					lastName: client.lastName || '',
					companyName: client.companyName || '',
					address: client.address || '',
					region: client.region || '',
					city: client.city || '',
					nationality: client.nationality || '',
					dateOfBirth: client.dateOfBirth?.split('T')[0] || '',
					gender: client.gender || '',
					phone: Array.isArray(client.phone) ? client.phone.join(', ') : client.phone || '',
					email: client.email || ''
				});
			} catch (err) {
				console.error(err);
				setError('Failed to load client data.');
			} finally {
				setLoading(false);
			}
		}
		fetchClient();
	}, [id]);

	function handleChange(e) {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormErrors([]);

		const updatedData = {
			...formData,
			phone: formData.phone.split(',').map((p) => p.trim())
		};

		try {
			const result = await updateClient(id, updatedData);
			toast.success('Client Updated Successfully');
			console.log('✅ Client updated:', result);
			navigate('/clients');
		} catch (error) {
			if (error.errors) {
				setFormErrors(error.errors.map((err) => err.msg));
			} else {
				setFormErrors([error.message || 'Something went wrong']);
			}
			toast.error('Failed to Update client');
		}
	};

	if (loading) return <p>Loading client data...</p>;
	if (error) return <p className="text-danger">{error}</p>;

	return (
		<div className="container mt-4">
			<h2 className="text-primary mb-4">Edit Client</h2>

			{formErrors.length > 0 && (
				<div className="alert alert-danger">
					<ul className="mb-0">
						{formErrors.map((err, idx) => (
							<li key={idx}>{err}</li>
						))}
					</ul>
				</div>
			)}

			<form onSubmit={handleSubmit} className="row g-3">
				{[
					['firstName', 'First Name'],
					['middleName', 'Middle Name'],
					['lastName', 'Last Name'],
					['companyName', 'Company Name'],
					['address', 'Address'],
					['region', 'Region'],
					['city', 'City'],
					['nationality', 'Nationality'],
					['dateOfBirth', 'Date of Birth'],
					['gender', 'Gender'],
					['phone', 'Phone (comma-separated)'],
					['email', 'Email']
				].map(([name, label]) => {
					if (name === 'gender') {
						return (
							<div className="col-md-6" key={name}>
								<label htmlFor={name} className="form-label">
									{label}
								</label>
								<select
									id={name}
									name={name}
									className="form-select"
									value={formData[name]}
									onChange={handleChange}
									required
								>
									<option value="">Select gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
							</div>
						);
					}

					return (
						<div className="col-md-6" key={name}>
							<label htmlFor={name} className="form-label">
								{label}
							</label>
							<input
								type={name === 'dateOfBirth' ? 'date' : name === 'email' ? 'email' : 'text'}
								id={name}
								name={name}
								className="form-control"
								value={formData[name]}
								onChange={handleChange}
								required={name !== 'middleName'}
							/>
						</div>
					);
				})}

				<div className="col-12">
					<button type="submit" className="btn btn-primary me-2">
						Save Changes
					</button>
					<button type="button" className="btn btn-secondary" onClick={() => navigate('/clients')}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export default EditClientPage;
