import { validationResult } from 'express-validator';
import {
	getAllClientsModel,
	addClientModel,
	getClientByIdModel,
	updateClientModel,
	deleteClientModel
} from '../models/models.js';
import { logEvent } from '../utilities/logger.js';

export async function getAllClientsController(req, res) {
	try {
		const records = await getAllClientsModel();
		/* await logEvent({event_type:'EVENT', event_subject:'FETCH', event_message:'Fetched All Clients'}) */
		res.status(200).json(records);
	} catch (error) {
		return next(error)
	}
}

export const getClientByIdController = async (req, res, next) => {
	const { id } = req.params;
	try {
		const record = await getClientByIdModel(id);

		if (!record) {
			const error = new Error(`Client with ID ${id} not found`);
			error.status = 404;
			error.context = { id };
			return next(error); // ✅ Forward to error middleware
		}

		await logEvent({
			type: 'event',
			subject: 'FETCH',
			message: `Fetched client ID ${id}`,
			user_id: req.user?.id || null,
			extra_data: { id }
		});

		res.json(record);
	} catch (error) {
		next(error); // ✅ Any DB/logic error goes here
	}
};

// controllers/api/clientsapicontroller.js
export const addClientController = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(errors.array())
	}
	try {
		const record = req.body;
		const newRecord = await addClientModel(record);
		await logEvent({
			type: 'WARNING',
			subject: 'Add Client',
			message: `Added client ${record.firstName} ${record.lastName}`
		});
		res.status(201).json(newRecord);
	} catch (error) {
		return next(error);
	}
};

export async function updateClientController(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(errors);
	}
	try {
		const { id } = req.params;
		const allowedFields = [
			'firstName',
			'middleName',
			'lastName',
			'companyName',
			'address',
			'region',
			'city',
			'nationality',
			'dateOfBirth',
			'gender',
			'phone',
			'email'
		];

		const updateData = {};
		for (const field of allowedFields) {
			if (req.body[field] !== undefined) {
				updateData[field] = req.body[field];
			}
		}
		updateData.phone = Array.isArray(updateData.phone) ? updateData.phone : [updateData.phone];
		updateData.id = id;
		const updatedRecord = await updateClientModel(updateData); // Now pass dynamically built object

		if (!updatedRecord) {
			return next(errors);
		}
		await logEvent({
			event_type: 'WARNING',
			event_subject: 'UPDATE CLIENT',
			event_message: `Updated client ID ${id}: ${updatedRecord.firstName || ''}  ${updatedRecord.lastName || ''}`
		});
		res.status(200).json({ message: 'Client updated successfully', updatedClient });
	} catch (error) {
		return next(error);
	}
}

export async function deleteClientController(req, res) {
	try {
		const { id } = req.params;
		const deletedRecord = await deleteClientModel(id);

		if (!deletedRecord) {
			return next(errors);
		}
		await logEvent({
			event_type: 'WARNING',
			event_subject: 'Client Deleted',
			event_message: `Deleted client ID ${id}`
		});
		res.status(200).json({ message: 'Client deleted successfully' });
	} catch (error) {
		return next(error);
	}
}
