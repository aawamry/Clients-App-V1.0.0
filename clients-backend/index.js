// -------------------- Imports --------------------
import express from 'express';                                           // Core Express framework
import path from 'path';                                                 // For file path resolution
import { fileURLToPath } from 'url';                                     // To convert import.meta.url to __dirname
import 'dotenv/config';                                                  // Load environment variables from .env file
import cors from 'cors';                                                 // Enable CORS for API requests

import clientAPIRoutes  from './api/clientsapirouts.js'                // Client API routes
import logAPIRoutes from './api/logsapiroutes.js';                    
import csvImportExportRoutes from './api/importerexporterapiroutes.js';                    
import errorHandler from './middlewares/errorHandler.js';
import { initClientsDB } from './data/clientsdatabase.js';
import { initEventsLogDB } from './data/logsdatabase.js';

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

app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error); // 👈 Pass to your errorHandler
});

app.use(errorHandler);

// -------------------- Start Server --------------------
async function startServer() {
    try {
        console.log('--- Initializing Databases ---');
        await initClientsDB(); // Initialize clients DB first
        await initEventsLogDB(); // Initialize events log DB next, AND FULLY AWAIT IT
        console.log('✅ All databases initialized successfully.');

        // Start listening for requests ONLY AFTER databases are ready
        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to start server or initialize databases:', error);
        process.exit(1); // Exit if DB init fails
    }
}

// Call the startServer function
startServer();
