import express from 'express';
import { body } from 'express-validator';

import {
  getAllClientsController,
  getClientByIdController,
  addClientController,
  updateClientController,
  deleteClientController
} from '../controllers/clientsapicontroller.js';



const router = express.Router();

const clientValidationRules = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
];

// GET /api/clients — Get all clients
router.get('/', getAllClientsController);

// POST /api/clients — Create a new client
router.post('/', clientValidationRules, addClientController);

// GET /api/clients/:id — Get client by ID
router.get('/:id', getClientByIdController);

// PUT /api/clients/:id — Update a client
router.put('/:id', clientValidationRules, updateClientController);

// DELETE /api/clients/:id — Delete a client
router.delete('/:id', deleteClientController);

export default router;
