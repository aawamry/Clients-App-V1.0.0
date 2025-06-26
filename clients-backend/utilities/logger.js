import { insertLogQuery } from "../data/queries.js";
import {initEventsLogDB}  from "../data/logsdatabase.js";

initEventsLogDB
export async function logEvent({
  type,
  subject,
  message,
  user_id = null,
  extra_data = null,
}) {
  if (!type || typeof type !== 'string') {
    throw new Error('Logger.js - "type" is required and must be a string.');
  }

  const dbInstance = await initEventsLogDB();
  return new Promise((resolve, reject) => {
    dbInstance.run(
      insertLogQuery,
      [
        type,
        subject,
        message,
        user_id,
        JSON.stringify(extra_data),
      ],
      function (err) {
        if (err) {
          console.error('❌ Logger.js - Logger Error:', err.message);
          return reject(err);
        }
        console.log('📝 Logger.js - Event Logged:', subject);
        resolve({ id: this.lastID });
      }
    );
  });
}
