import { validationResult } from 'express-validator';
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
		await logEvent({event_type:'EVENT', event_subject:'FETCH', event_message:'Fetched All Clients'})
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
		await logEvent({event_type:'EVENT', event_subject:'FETCH', event_message:`Fetched client ID ${id}`});
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
		await logEvent({event_type:'WARNING', event_subject:'Add Client', event_message:`Added client ${client.firstName} ${client.lastName}`});
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
		await logEvent({event_type:'WARNING',event_subject:'UPDATE CLIENT', event_message:`Updated client ID ${id}: ${firstName} ${lastName}`});
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
		await logEvent({ event_type: 'WARNING', event_subject: 'Client Deleted', event_message:`Deleted client ID ${id}` });
		res.status(200).json({ message: 'Client deleted successfully' });
	} catch (error) {
		await logEvent({event_type:'ERROR', event_subject:'Delet Failed', event_message:`Delete client ID ${req.params.id} failed: ${error.message}`});
		res.status(500).json({ error: error.message });
	}
}


