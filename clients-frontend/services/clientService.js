const API_BASE_URL = 'http://localhost:3000/api/clients';

export async function getClients() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching clients:', error);
    throw error;
  }
}

// --- Add New Client ---
export async function addClient(data) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Backend returned validation error:', result.errors || result.error);
      // Throw the actual backend errors
      throw result; // Could be { error: "..."} or { errors: [...] }
    }

    return result;
  } catch (error) {
    console.error('❌ Error in addClient:', error);
    throw error;
  }
}

export async function getClientById(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch client');
  return await res.json();
}

export async function updateClient(id, updatedData) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  });
  if (!res.ok) throw new Error('Failed to update client');
  return await res.json();
}