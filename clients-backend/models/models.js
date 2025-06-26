import {initClientsDB} from '../data/clientsdatabase.js';
import {
	getAllQuery,
	getByFieldQuery,
	getByIdQuery,
	insertClientQuery,
	updateClientQuery,
	deleteClientQuery,
} from '../data/queries.js';

export async function getAllClientsModel() {
	const dbInstance = await initClientsDB();
	const records = await dbInstance.all(getAllQuery('clients'));

	console.log('📄 models.js - Retrieved clients from DB:', records.length);

	return records;
}

export async function getClientsByFieldModel(field, value) {
	const dbInstance = await initClientsDB();

	const allowedFields = [
		'id',
		'firstName',
		'lastName',
		'companyName',
		'region',
		'city',
		'dateOfBirth',
		'gender',
		'phone',
		'email'
	];

	if (!allowedFields.includes(field)) {
		console.error(`❌ models.js -Field ${field} is not allowed for searching.`);
		throw new Error(`models.js - Field ${field} is not allowed for searching.`);
	}

	const records = await dbInstance.all(getByFieldQuery('clients', field), [`%${value}%`]);
	console.log('📄 models.js - Retrieved matching clients:', records.length);

	return records;
}

export const getClientByIdModel = async (id) => {
	try {
		const dbInstance = await initClientsDB();
		const record = await dbInstance.get(getByIdQuery('clients'), [id]);

		console.log('🔍 models.js -Raw DB client:', record);

		if (!record) return null;

		// Map DB snake_case to frontend camelCase
		return {
			id: record.id,
			firstName: record.firstName,
			middleName: record.middleName,
			lastName: record.lastName,
			companyName: record.companyName,
			address: record.address,
			region: record.region,
			city: record.city,
			nationality: record.nationality,
			dateOfBirth: record.dateOfBirth,
			gender: record.gender,
			phone: record.phone?.split(',') || [],
			email: record.email
		};
	} catch (error) {
		console.error('models.js - Database error in getClientByIdModel:', error);
		throw error;
	}
};


export async function addClientModel({
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
	phone = [],
	email,
}) {
	console.log('➕ models.js - addClient called with:', { firstName, lastName, companyName, phone, city, email });

	const dbInstance = await initClientsDB();
	const phoneString = Array.isArray(phone) ? phone.join(',') : phone;
	const result = await dbInstance.run(insertClientQuery('clients'), [
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
		phoneString,
		email,
	]);

	console.log('📤 models.js - Insert result:', result);

	if (result.changes > 0) {
		console.log('✅ models.js - Client added with ID:', result.lastID);
		return {
			id: result.lastID,
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
			phone: phoneString,
			email,
		};
	} else {
		console.warn('⚠️ models.js - No Client was added.');
		return null;
	}
}

export async function updateClientModel({
	id,
	firstName,
	middleName,
	lastName,
	companyName,
	address = '',
	region = '',
	city,
	nationality,
	dateOfBirth,
	gender,
	phone = [],
	email
}) {
	const dbInstance = await initClientsDB();
	const phoneArray = Array.isArray(phone) ? phone : [phone];
	const phoneString = phoneArray.join(',');

	console.log('🔄 models.js - Updating client in DB with ID:', id);
	console.log('🔄 models.js - Update parameters:', [
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
		phoneString,
		email,
		id
	]);

	try {
		const result = await dbInstance.run(updateClientQuery('clients'), [
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
			phoneString,
			email,
			id
		]);

		console.log('🔄 models.js - DB update completed:', result);

		if (result.changes > 0) {
			return {
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
				phone: phoneString,
				email
			};
		}
	} catch (error) {
		console.error('❌ models.js - Error updating client:', error);
		throw error;
	}

	return null;
}

export async function deleteClientModel(id) {
	const dbInstance = await initClientsDB();
	await dbInstance.run(deleteClientQuery('clients'), [id]);
	return { message: `Client ${id} Deleted Successfully` };
}
