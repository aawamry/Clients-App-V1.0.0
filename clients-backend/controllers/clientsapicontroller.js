import { validationResult } from 'express-validator';
import {
	getAllClientsModel,
	addClientModel,
	getClientByIdModel,
	updateClientModel,
	deleteClientModel
} from '../models/models.js';
import { logEvent } from '../utilities/logger.js';

export async function getAllClientsController(req, res, next) {
	try {
		const records = await getAllClientsModel();
		/* await logEvent({event_type:'EVENT', event_subject:'FETCH', event_message:'Fetched All Clients'}) */
		res.status(200).json(records);
	} catch (error) {
		return next(error);
	}
}

export const getClientByIdController = async (req, res, next) => {
	const { id } = req.params;
	console.log('🔍 Controller.js - Received request for ID:', id);

	try {
		const record = await getClientByIdModel(id);
		console.log('📦 Controller - Got record from DB:', record);

		if (!record) {
			console.log(`⚠️ Controller - Client ID ${id} not found. Forwarding to error handler.`);
			const error = new Error(`Client with ID ${id} not found`);
			error.status = 404;
			error.context = { id };
			return next(error); // ✅ Forward to error middleware
		}

		try {
			await logEvent({
				type: 'event',
				subject: 'FETCH',
				message: `Fetched client ID ${id}`,
				user_id: req.user?.id || null,
				extra_data: { id }
			});
			console.log(`📝 Logged successful fetch for client ID ${id}.`);
		} catch (logError) {
			console.error(`❌ Logger failed to log fetch for client ID ${id}:`, logError.message);
		}
		console.log('DEBUG: Attempting to send simple string response.');
		return res.status(200).json(record)
	} catch (error) {
		console.error(`❌ Controller - Caught unexpected error for client ID ${id}:`, error.message);
		return next(error); // ✅ Any DB/logic error goes here
	}
};

// controllers/api/clientsapicontroller.js
export const addClientController = async (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(errors.array());
	}
	try {
		const record = req.body;
		const newRecord = await addClientModel(record);
		await logEvent({
			type: 'WARNING',
			subject: 'Add Client',
			message: `Added client ${record.firstName} ${record.lastName}`
		});
		return res.status(201).json(newRecord);
	} catch (error) {
		return next(error);
	}
};

export async function updateClientController(req, res, next) {
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
			type: 'WARNING',
			subject: 'UPDATE CLIENT',
			message: `Updated client ID ${id}: ${updatedRecord.firstName || ''}  ${updatedRecord.lastName || ''}`
		});
		return res.status(200).json({ message: 'Client updated successfully', updatedRecord });
	} catch (error) {
		return next(error);
	}
}

export async function deleteClientController(req, res, next) {
	try {
		const { id } = req.params;
		const deletedRecord = await deleteClientModel(id);

		if (!deletedRecord) {
			const error = new Error(`Client with ID ${id} not found or already deleted`);
			error.status = 404;
			return next(error);
		}
		await logEvent({
			type: 'WARNING',
			subject: 'Client Deleted',
			message: `Deleted client ID ${id}`
		});
		return res.status(200).json({ message: 'Client deleted successfully' });
	} catch (error) {
		return next(error);
	}
}
