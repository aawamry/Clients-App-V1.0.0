import {
	getAllClientsModel,
	addClientModel,
	getClientByIdModel,
	updateClientModel,
	deleteClientModel
} from '../models/models.js';

import { validationResult } from 'express-validator';


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
			firstName, middleName, lastName, companyName,
			address, region, city, nationality, dateOfBirth,
			gender, phone, email
		} = req.body;

		const phoneArray = Array.isArray(phone) ? phone : [phone];

		const updatedClient = await updateClientModel(
			{id, firstName, middleName, lastName, companyName,
			address, region, city, nationality, dateOfBirth,
			gender, phone: phoneArray, email}
		);

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
