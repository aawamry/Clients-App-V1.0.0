// db/clientsDatabase.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createClientsTableQuery } from './queries.js';

// Resolve DB path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'clients_database.db');
console.log('📁 Resolved DB file path:', dbPath);

let db = null;

// -------------------------- Initialize Database Connection --------------------------
export async function initClientsDB() {
	if (!db) {
		sqlite3.verbose();
		console.log('🔌 Initializing Clients DB connection...');
		db = await open({
			filename: dbPath,
			driver: sqlite3.Database
		});
		console.log('✅ Clients DB connection established');
		await db.run(createClientsTableQuery());
		console.log('✅ Clients table created or already exists.');
	}
	return db;
}

// -------------------------- Backup Database --------------------------
export async function backupClientsDB(backupFolder = './backups') {
	try {
		await fs.mkdir(backupFolder, { recursive: true });

		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const fileName = `clients-backup-${timestamp}.db`;
		const backupPath = path.join(backupFolder, fileName);

		await fs.copyFile(dbPath, backupPath);

		console.log(`✅ Clients DB backup created at ${backupPath}`);
		return backupPath;
	} catch (error) {
		console.error('❌ Failed to back up Clients DB:', error);
		throw error;
	}
}
