// logger/eventsLogDatabase.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { createEventsLogTableQuery } from './queries.js'; // Make sure this is defined

// Resolve DB path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'events_database.db');
console.log('📁 Resolved Events Log DB file path:', dbPath);

let db = null;

// -------------------------- Initialize Database Connection --------------------------
export async function initEventsLogDB() {
	if (!db) {
		sqlite3.verbose();
		console.log('🔌 Initializing Events Log DB connection...');
		db = await open({
			filename: dbPath,
			driver: sqlite3.Database
		});
		console.log('✅ Events Log DB connection established');
		await db.run(createEventsLogTableQuery());
		console.log('✅ Events Log table created or already exists.');
	}
	return db;
}

// -------------------------- Backup Database --------------------------
export async function backupEventsLogDB(backupFolder = './backups') {
	try {
		await fs.mkdir(backupFolder, { recursive: true });

		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const fileName = `events-backup-${timestamp}.db`;
		const backupPath = path.join(backupFolder, fileName);

		await fs.copyFile(dbPath, backupPath);

		console.log(`✅ Events Log DB backup created at ${backupPath}`);
		return backupPath;
	} catch (error) {
		console.error('❌ Failed to back up Events Log DB:', error);
		throw error;
	}
}
