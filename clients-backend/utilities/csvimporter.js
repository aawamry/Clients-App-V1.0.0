// utilities/csvimporter.js
import { addClientModel } from '../models/models.js';

export async function importClientsCSV(req, res) {
    const clientsToImport = req.body;

    if (!Array.isArray(clientsToImport)) {
        return res.status(400).json({ error: 'Invalid input: expected an array of clients' });
    }

    const importResults = {
        successful: 0,
        failed: 0,
        errors: [],
        importedClients: []
    };

    for (const clientData of clientsToImport) {
        // Basic validation: Check for essential fields
        if (!clientData.firstName || !clientData.lastName || !clientData.email) {
            importResults.failed++;
            importResults.errors.push({
                client: clientData,
                reason: 'Missing essential fields (firstName, lastName, email)'
            });
            console.warn('⚠️ Skipping client due to missing essential fields:', clientData);
            continue; // Skip to the next client
        }

        try {
            // Ensure phone is handled correctly if it comes as a string from CSV
            // and addClientModel expects an array.
            if (typeof clientData.phone === 'string' && clientData.phone.includes(',')) {
                clientData.phone = clientData.phone.split(',').map(p => p.trim());
            } else if (typeof clientData.phone === 'string' && clientData.phone !== '') {
                clientData.phone = [clientData.phone.trim()];
            } else {
                clientData.phone = []; // Default to empty array if not provided or empty string
            }

            // You might need to clean up or transform other fields if your CSV data
            // doesn't perfectly match the addClientModel's expected format.
            // Example: ensure dateOfBirth is in a compatible format if needed by your DB.

            const newClient = await addClientModel(clientData);
            if (newClient) {
                importResults.successful++;
                importResults.importedClients.push(newClient);
                console.log('✅ Successfully added client:', newClient.firstName, newClient.lastName);
            } else {
                importResults.failed++;
                importResults.errors.push({
                    client: clientData,
                    reason: 'Failed to add client to database (addClientModel returned null)'
                });
                console.warn('❌ Failed to add client (addClientModel returned null):', clientData);
            }
        } catch (err) {
            importResults.failed++;
            importResults.errors.push({
                client: clientData,
                reason: err.message || 'Unknown database error'
            });
            console.error('❌ Error importing client:', clientData, err);
        }
    }

    if (importResults.successful > 0) {
        res.status(200).json({
            message: `Successfully imported ${importResults.successful} clients.`,
            ...importResults
        });
    } else if (importResults.failed > 0) {
        res.status(400).json({
            message: `Failed to import ${importResults.failed} clients. No clients were successfully imported.`,
            ...importResults
        });
    } else {
        res.status(200).json({ message: 'No clients were provided for import.', ...importResults });
    }
}