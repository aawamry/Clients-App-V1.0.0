import EventsLogDatabase from '../data/data.js';
import { insertLogQuery } from '../data/queries.js';

/**
 * Logs an event to the SQLite logs table
 * @param {Object} options
 * @param {string} options.event_type - Type of the event (e.g., 'import', 'update')
 * @param {string} options.event_subject - A short label like "Inventory"
 * @param {string} options.event_message - Description of the event
 * @param {string|null} [options.user_id=null] - ID of the acting user
 * @param {Object|null} [options.extra_data=null] - Additional data (stored as JSON)
 */
export async function logEvent({
  event_type,
  event_subject,
  event_message,
  user_id = null,
  extra_data = null,
}) {
  const dbInstance = await EventsLogDatabase.getInstance();
  const db = dbInstance.db;

  return new Promise((resolve, reject) => {
    db.run(
      insertLogQuery,
      [
        event_type,
        event_subject,
        event_message,
        user_id,
        JSON.stringify(extra_data),
      ],
      function (err) {
        if (err) {
          console.error('❌ Logger Error:', err.message);
          return reject(err);
        }
        console.log('📝 Event Logged:', event_message);
        resolve({ id: this.lastID });
      }
    );
  });
}
