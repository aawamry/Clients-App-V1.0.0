import { validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import fs from 'fs';
import ClientsDatabase from '../data/data.js';
import {
	getAllClientsModel,
	addClientModel,
	getClientByIdModel,
	updateClientModel,
	deleteClientModel
} from '../models/models.js';

export async function getAllClientsController(req, res) {
	try {
		const clients = await getAllClientsModel();
		res.status(200).json(clients);
	} catch (error) {
		console.error('❌ Error fetching clients:', error.message);
		res.status(500).json({ error: 'Failed to fetch clients' });
	}
}

export const getClientByIdController = async (req, res) => {
	const { id } = req.params;
	try {
		const client = await getClientByIdModel(id);
		if (!client) {
			return res.status(404).json({ error: 'Client not found' });
		}
		res.json(client);
	} catch (error) {
		console.error('Error fetching client by ID:', error);
		res.status(500).json({ error: 'Server error' });
	}
};

// controllers/api/clientsapicontroller.js
export const addClientController = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const client = req.body;
		const newClient = await addClientModel(client);
		res.status(201).json(newClient);
	} catch (err) {
		console.error('Add client failed:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export async function updateClientController(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const { id } = req.params;
		const {
			firstName,
			middleName,
			lastName,
			companyName,
			address,
			region,
			city,
			nationality,
			dateOfBirth,
			gender,
			phone,
			email
		} = req.body;

		const phoneArray = Array.isArray(phone) ? phone : [phone];

		const updatedClient = await updateClientModel({
			id,
			firstName,
			middleName,
			lastName,
			companyName,
			address,
			region,
			city,
			nationality,
			dateOfBirth,
			gender,
			phone: phoneArray,
			email
		});

		if (!updatedClient) {
			return res.status(404).json({ error: 'Client not found.' });
		}

		res.status(200).json({ message: 'Client updated successfully', updatedClient });
	} catch (error) {
		console.error('❌ Error in updateClient:', error.message);
		res.status(500).json({ error: 'Error updating client: ' + error.message });
	}
}

export async function deleteClientController(req, res) {
	try {
		const { id } = req.params;

		const deletedClient = await deleteClientModel(id);

		if (!deletedClient) {
			return res.status(404).json({ error: 'Client not found.' });
		}

		res.status(200).json({ message: 'Client deleted successfully' });
	} catch (error) {
		console.error('❌ Error deleting client:', error.message);
		res.status(500).json({ error: error.message });
	}
}

export const exportClientsCSV = async (req, res) => {
	try {
		const clients = await getAllClientsModel(); // your DB fetch function

		const fields = [
			'id',
			'firstName',
			'lastName',
			'companyName',
			'address',
			'region',
			'city',
			'nationality',
			'dateOfBirth',
			'gender',
			'phone',
			'email',
			'created_at'
		];
		const parser = new Parser({ fields });
		const csv = parser.parse(clients);

		res.header('Content-Type', 'text/csv');
		res.attachment('clients.csv');
		return res.send(csv);
	} catch (error) {
		console.error('CSV Export Error:', error);
		res.status(500).send('Failed to export clients.');
	}
};

export const importClientsCSV = async (req, res) => {
	const { data } = req.body;

	if (!Array.isArray(data) || data.length === 0) {
		return res.status(400).json({ error: 'No data provided' });
	}

	let importedCount = 0;

	try {
		const db = await ClientsDatabase.getInstance();

		for (const client of data) {
			// Validate fields
			if (!client.firstName || !client.lastName || !client.email || !client.phone) {
				console.warn('⚠️ Skipping invalid client:', client);
				continue;
			}

			// Check for existing phone/email
			const existing = await db.db.get(`SELECT * FROM clients WHERE phone = ? OR email = ?`, [
				client.phone,
				client.email
			]);

			if (existing) {
				console.warn('🚫 Duplicate client skipped:', client.phone, client.email);
				continue;
			}

			try {
				await addClientModel({
					...client,
					dateOfBirth: client.birthdate // map CSV field to DB field
				});
				importedCount++;
				console.log(`✅ Imported: ${client.firstName} ${client.lastName}`);
			} catch (insertErr) {
				console.error('❌ Error inserting client:', client, insertErr.message);
			}
		}

		res.json({ count: importedCount });
	} catch (err) {
		console.error('❌ CSV Import failed:', err.message);
		res.status(500).json({ error: 'CSV import failed' });
	}
};