const LOGS_API_URL = 'http://localhost:3000/api/logs';

export async function getAllLogs() {
	try {
		const response = await fetch(LOGS_API_URL);
		if (!response.ok) {
			throw new Error('Failed to fetch logs');
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching logs:', error);
		throw error;
	}
}
