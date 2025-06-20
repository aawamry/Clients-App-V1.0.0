const API_BASE_URL = 'http://localhost:3000/api/clients';

// Fetch all clients
export async function getAllClients() {
	try {
		const response = await fetch(API_BASE_URL);
		if (!response.ok) {
			throw new Error('Failed to fetch clients');
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching clients:', error);
		throw error;
	}
}

// Add a new client
export async function addClient(data) {
	try {
		const response = await fetch(API_BASE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		const result = await response.json();

		if (!response.ok) {
			const error = new Error(result.error || 'Failed to add client');
			error.errors = result.errors; // Pass validation errors to frontend
			throw error;
		}
		return result;
	} catch (error) {
		console.error('Error in addClient:', error);
		throw error;
	}
}

export async function getClientById(id) {
	const res = await fetch(`${API_BASE_URL}/${id}`);
	if (!res.ok) throw new Error('Failed to fetch client');

	const json = await res.json();
	console.log('📦 Raw API response:', json); // ADD THIS

	return json;
}

// ✅ Update existing client
export async function updateClient(id, data) {
	try {
		const response = await fetch(`${API_BASE_URL}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
		const result = await response.json();

		if (!response.ok) {
			const error = new Error(result.error || 'Failed to update client');
			error.errors = result.errors; // Include validation errors if any
			throw error;
		}
		return result;
	} catch (error) {
		console.error('Error in updateClient:', error);
		throw error;
	}
}

export async function deleteClient(id) {
	try {
		const response = await fetch(`${API_BASE_URL}/${id}`, {
			method: 'DELETE'
		});
		if (!response.ok) {
			throw new Error('Failed to delete client');
		}
		return await response.json();
	} catch (error) {
		console.error('Error deleting client:', error);
		throw error;
	}
}
