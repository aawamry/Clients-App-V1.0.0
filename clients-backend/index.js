// -------------------- Imports --------------------
import express from 'express';                                           // Core Express framework
import path from 'path';                                                 // For file path resolution
import { fileURLToPath } from 'url';                                     // To convert import.meta.url to __dirname
import 'dotenv/config';                                                  // Load environment variables from .env file
import cors from 'cors';                                                 // Enable CORS for API requests

import clientAPIRoutes  from './api/clientsapirouts.js'                // Client API routes
import logAPIRoutes from './api/logsapiroutes.js';                    
import csvImportExportRoutes from './api/importerexporterapiroutes.js';                    

// -------------------- App Setup --------------------
const app = express();                                                  // Initialize Express app
const PORT = process.env.PORT || 3000;                                  // Server port

// -------------------- Directory Setup --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------- Middleware Setup --------------------
app.use(cors());                                                        // Enable CORS
app.use(express.urlencoded({ extended: true }));                        // Parse form data
app.use(express.json({ limit: '5mb' }));

// 🔓 Expose uploads and logs folders if needed
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/logs', express.static(path.join(__dirname, 'logs')));

// -------------------- API Routes --------------------
app.use('/api/clients', clientAPIRoutes);   // Mount clients API routes
app.use('/api/logs', logAPIRoutes);                     // Mount logs API routes        
app.use('/api/csv', csvImportExportRoutes);                     // Mount csv API routes        

// -------------------- 404 & Error Handlers --------------------
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// -------------------- Start Server --------------------
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
