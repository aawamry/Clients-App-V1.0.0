import express from 'express';
import { initEventsLogDB } from '../data/logsdatabase.js';
import { getAllLogsQuery } from '../data/queries.js';
import { logEvent } from '../utilities/logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const dbInstance = await initEventsLogDB();
    const rows = await dbInstance.all(getAllLogsQuery);

    console.log('rows?', rows);

    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching logs:', err.message);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});


// ------------------ POST: Log an event ------------------
router.post('/', async (req, res) => {
  const {
    type,
    subject,
    message,
    user_id = null,
    extra_data = null
  } = req.body;

  if (!type || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await logEvent({
      type,
      subject,
      message,
      user_id,
      extra_data
    });
    res.status(201).json({ message: 'Event logged', id: result.id });
  } catch (err) {
    console.error('Error logging event:', err.message);
    res.status(500).json({ error: 'Failed to log event' });
  }
});

export default router;
