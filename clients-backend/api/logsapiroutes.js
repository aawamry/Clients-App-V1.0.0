import express from 'express';
import EventsLogDatabase from '../data/data.js';
import { getAllLogsQuery } from '../data/queries.js';
import { logEvent } from '../utils/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const dbInstance = await EventsLogDatabase.getInstance();
    const db = dbInstance.db;

    const rows = await db.all(getAllLogsQuery);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ POST: Log an event ------------------
router.post('/', async (req, res) => {
  const {
    event_type,
    event_subject,
    event_message,
    user_id = null,
    extra_data = null
  } = req.body;

  if (!event_type || !event_subject || !event_message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await logEvent({
      event_type,
      event_subject,
      event_message,
      user_id,
      extra_data
    });
    res.status(201).json({ message: 'Event logged', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log event' });
  }
});

export default router;
