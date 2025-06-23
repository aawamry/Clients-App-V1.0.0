import express from 'express';
import upload from '../utilities/upload.js';
import { exportClientsCSV } from '../utilities/csvexporter.js';
import { importClientsCSV } from '../utilities/csvimporter.js';

const router = express.Router();


router.get('/export-csv', exportClientsCSV);

router.post('/import-csv', upload.single('file'), importClientsCSV);

export default router;