import express from 'express';
import { exportClientsCSV } from '../utilities/csvexporter.js';
import { importClientsCSV } from '../utilities/csvimporter.js';

const router = express.Router();


router.get('/export-csv', exportClientsCSV);

router.post('/import-csv', importClientsCSV);

export default router;