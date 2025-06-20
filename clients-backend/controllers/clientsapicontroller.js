import { validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import fs from 'fs/promises';
import path from 'path';
import {initClientsDB} from '../data/clientsdatabase.js';
import {
	getAllClientsModel,
	addClientModel,
	getClientByIdModel,
	updateClientModel,
	deleteClientModel
} from '../models/models.js';
import { logEvent } from '../utilities/logger.js'

export async function getAllClientsController(req, res) {
	try {
		const clients = await getAllClientsModel();
		await logEvent({event_type:'Event', event_subject:'FETCH', event_message:'Fetched All Clients'})
		res.status(200).json(clients);
	} catch (error) {
		await logEvent({event_type:'ERROR', event_subject:'Fetching clients failed', event_message:`: ${error.message}`});
		res.status(500).json({ error: 'Failed to fetch clients' });
	}
}

export const getClientByIdController = async (req, res) => {
	const { id } = req.params;
	try {
		const client = await getClientByIdModel(id);
		if (!client) {
			await logEvent({event_type:'ERROR', event_subject:'NOT_FOUND', event_message:`Client with ID ${id} not found`});
			return res.status(404).json({ error: 'Client not found' });
		}
		await logEvent({event_type:'Event', event_subject:'FETCH', event_message:`Fetched client ID ${id}`});
		res.json(client);
	} catch (error) {
		await logEvent({event_type:'ERROR', event_subject:'Fetching client failed', event_message:`: ${error.message}`});
		res.status(500).json({ error: 'Server error' });
	}
};

// controllers/api/clientsapicontroller.js
export const addClientController = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		await logEvent({event_type:'ERROR', event_subject:'Validation Error', event_message:`Add client validation failed: ${JSON.stringify(errors.array())}`});
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const client = req.body;
		const newClient = await addClientModel(client);
		await logEvent({event_type:'Event', event_subject:'Add Client', event_message:`Added client ${client.firstName} ${client.lastName}`});
		res.status(201).json(newClient);
	} catch (err) {
		await logEvent({event_type:'ERROR', event_subject:'Add client failed', event_message: ` ${err.message}`});
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export async function updateClientController(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		await logEvent({event_type:'ERROR', event_subject:'VALIDATION_ERROR', event_message:`Update validation failed: ${JSON.stringify(errors.array())}`});
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
			await logEvent({
				event_type: 'ERROR',
				event_subject: 'NOT_FOUND',
				event_message: `Client ID ${id} not found for update`
			});
			return res.status(404).json({ error: 'Client not found.' });
		}
		await logEvent({event_type:'EVENT',event_subject:'UPDATE', event_message:`Updated client ID ${id}: ${firstName} ${lastName}`});
		res.status(200).json({ message: 'Client updated successfully', updatedClient });
	} catch (error) {
		await logEvent({event_type:'ERROR', event_subject:'client update failed',event_message:` ${req.params.id}: ${error.message}`});
		res.status(500).json({ error: 'Error updating client: ' + error.message });
	}
}

export async function deleteClientController(req, res) {
	try {
		const { id } = req.params;
		const deletedClient = await deleteClientModel(id);

		if (!deletedClient) {
			await logEvent({
				event_type: 'ERROR',
				event_subject: 'NOT_FOUND',
				event_message: `Delete failed: Client ID ${id} not found`
			});
			return res.status(404).json({ error: 'Client not found.' });
		}
		await logEvent({ event_type: 'EVENT', event_subject: 'Client Deleted', event_message:`Deleted client ID ${id}` });
		res.status(200).json({ message: 'Client deleted successfully' });
	} catch (error) {
		await logEvent({event_type:'ERROR', event_subject:'Delet Failed', event_message:`Delete client ID ${req.params.id} failed: ${error.message}`});
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
		await logEvent({event_type:'EVENT', event_subject:'Clients Export Succeeded', event_message:`Exported ${clients.length} clients to CSV`});
		res.header('Content-Type', 'text/csv');
		res.attachment('clients.csv');
		await logEvent({event_type:'EVENT',event_subject:'SENT', event_message:`Sent ${clients.length} clients to CSV`});
		return res.send(csv);
	} catch (error) {
		await logEvent({event_type:'ERROR', event_subject:'Clients Export Failed', event_message:`CSV export failed: ${error.message}`});
		res.status(500).send('Failed to export clients.');
	}
};

export const importClientsCSV = async (req, res) => {
	const { data } = req.body;

	if (!Array.isArray(data) || data.length === 0) {
		await logEvent({event_type:'ERROR', event_subject:'CSV VALIDATION_ERROR', event_message:`CSV import failed: empty or invalid data`});
		return res.status(400).json({ error: 'Client sent something wrong' });
	}

	let importedCount = 0;
	let unimportedCount = 0;
	const importedClients = [];
	const skippedClients = [];

	try {
		const { db: dbInstance } = await initClientsDB();
		await logEvent({event_type:'EVENT', event_subject:'IMPORT CSV Started', event_message:`Started importing ${data.length} clients`});

		for (const client of data) {
			if (!client.firstName || !client.lastName || !client.email || !client.phone) {
				console.warn('⚠️ Skipping invalid client:', client);
				skippedClients.push({ reason: 'Missing required fields', client });
				unimportedCount++;
				continue;
			}

			const existing = await dbInstance.get(`SELECT * FROM clients WHERE phone = ? OR email = ?`, [
				client.phone,
				client.email
			]);

			if (existing) {
				console.warn('🚫 Duplicate client skipped:', client.phone, client.email);
				skippedClients.push({ reason: 'Duplicate', client });
				unimportedCount++;
				continue;
			}

			try {
				await addClientModel({
					...client,
					dateOfBirth: client.birthdate
				});
				importedClients.push(client);
				importedCount++;
				console.log(`✅ Imported: ${client.firstName} ${client.lastName}`);
			} catch (insertErr) {
				console.error('❌ Error inserting client:', client, insertErr.message);
				skippedClients.push({ reason: insertErr.message, client });
				unimportedCount++;
			}
		}

		// 📝 Prepare text content
		let fileContent = `--- Import Report ---\n\n`;
		fileContent += `✅ Imported: ${importedCount}\n`;
		fileContent += `❌ Skipped: ${unimportedCount}\n\n`;

		fileContent += `--- Imported Clients ---\n`;
		importedClients.forEach((c, i) => {
			fileContent += `${i + 1}. ${c.firstName} ${c.lastName} | ${c.email} | ${c.phone}\n`;
		});

		fileContent += `\n--- Skipped Clients ---\n`;
		skippedClients.forEach((item, i) => {
			fileContent += `${i + 1}. ${item.client.firstName || 'N/A'} ${item.client.lastName || 'N/A'} | ${
				item.client.email || 'N/A'
			} | Reason: ${item.reason}\n`;
		});

		// 🗂️ Write to file
		const reportPath = path.resolve('logs', `import_report_${Date.now()}.txt`);
		await fs.mkdir(path.dirname(reportPath), { recursive: true });
		await fs.writeFile(reportPath, fileContent);
		console.log('✅ Log file written successfully:', reportPath);

		await logEvent(
			{event_type:'EVENT', event_subject:'IMPORT_SUCCESS',
			event_message:`Import complete: ${importedCount} added, ${unimportedCount} skipped`}
		);

		// 🎯 Send file path or result
		res.json({
			message: `✅ ${importedCount} imported, ❌ ${unimportedCount} skipped.`,
			imported: importedCount,
			skipped: unimportedCount,
			report: reportPath
		});
	} catch (err) {
		console.error('❌ CSV Import failed:', err.message);
		await logEvent({event_type:'ERROR', event_subject:'CSV import failed:', event_message:` ${err.message}`});
		res.status(500).json({ error: 'CSV import failed' });
	}
};
