import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addClient } from '../services/clientService';

function AddClientPage() {
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

	const [formErrors, setFormErrors] = useState([]); // ✅ declared properly

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormErrors([]); // Clear previous errors

		const cleanedData = {
			...formData,
			phone: formData.phone.trim(),
			email: formData.email.trim()
		};

		try {
			const result = await addClient(cleanedData);
			console.log('✅ Client added:', result);
			navigate('/clients');
		} catch (error) {
			if (error.errors) {
				setFormErrors(error.errors.map((err) => err.msg));
			} else {
				setFormErrors([error.message || 'Something went wrong']);
			}
		}
	};

	return (
		<div className="container">
			<h2 className="text-primary mb-4">Add New Client</h2>

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
					['firstName', 'First Name', 'text'],
					['middleName', 'Middle Name', 'text'],
					['lastName', 'Last Name', 'text'],
					['companyName', 'Company Name', 'text'],
					['address', 'Address', 'text'],
					['region', 'Region', 'text'],
					['city', 'City', 'text'],
					['nationality', 'Nationality', 'text'],
					['dateOfBirth', 'Date of Birth', 'date'],
					['phone', 'Phone (comma-separated)', 'tel'],
					['email', 'Email', 'email']
				].map(([name, label, type]) => (
					<div className="col-md-6" key={name}>
						<label htmlFor={name} className="form-label">{label}</label>
						<input
							type={type}
							className="form-control"
							id={name}
							name={name}
							value={formData[name]}
							onChange={handleChange}
							required={name !== 'middleName'} // optional middle name
						/>
					</div>
				))}

				<div className="col-md-6">
					<label htmlFor="gender" className="form-label">Gender</label>
					<select
						id="gender"
						name="gender"
						className="form-select"
						value={formData.gender}
						onChange={handleChange}
						required
					>
						<option value="">-- Select Gender --</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="other">Other</option>
					</select>
				</div>

				<div className="col-12">
					<button type="submit" className="btn btn-success me-2">Add Client</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => navigate('/clients')}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}

export default AddClientPage;
