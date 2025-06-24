import { Parser } from 'json2csv';
import { getAllClientsModel } from '../models/models.js';
import { logEvent } from '../utilities/logger.js';

export const exportClientsCSV = async (req, res) => {
	try {
		const records = await getAllClientsModel(); // your DB fetch function

		const fields = Array.from(new Set(records.flatMap(Object.keys)));
		const parser = new Parser({ fields });
		const csv = parser.parse(clients);
		const fileName = `clients_export_${new Date().toISOString().slice(0, 10)}.csv`;
		await logEvent({
			event_type: 'WARNING',
			event_subject: 'Clients Export Succeeded',
			event_message: `Exported ${clients.length} clients to CSV`
		});
		res.header('Content-Type', 'text/csv');
		res.attachment(fileName);
		await logEvent({
			event_type: 'WARNING',
			event_subject: 'SENT',
			event_message: `Sent ${clients.length} clients to CSV`
		});
		return res.send(csv);
	} catch (error) {
		await logEvent({
			event_type: 'ERROR',
			event_subject: 'Clients Export Failed',
			event_message: `CSV export failed: ${error.message}`
		});
		res.status(500).send('Failed to export clients.');
	}
};
