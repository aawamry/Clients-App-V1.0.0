import { insertLogQuery } from "../data/queries.js";
import {initEventsLogDB}  from "../data/logsdatabase.js";

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
  console.log('DEBUG: logEvent - DB instance obtained.');
  
  try {
    console.log('DEBUG: logEvent - About to run dbInstance.run');
    console.log('DEBUG: logEvent - Query:', insertLogQuery);
    console.log('DEBUG: logEvent - Params:', [type, subject, message, user_id, JSON.stringify(extra_data)]);

    // Directly await the dbInstance.run promise
    const result = await dbInstance.run(
      insertLogQuery,
      [
        type,
        subject,
        message,
        user_id,
        JSON.stringify(extra_data),
      ]
    );

    console.log('📝 Logger.js - Event Logged SUCCESSFULLY:', subject);
    console.log('📝 Logger.js - Insert Result:', result); // Log the result object
    // If you need lastID, it's typically result.lastID for .run
    // resolve({ id: result.lastID }); // No need for resolve/reject with direct await

  } catch (err) {
    console.error('❌ Logger.js - Logger Error (Direct Await):', err.message);
    // You might re-throw the error if you want callers to handle it,
    // or just log it and continue. For a logger, often just logging is enough.
    // throw err;
  }
  console.log('DEBUG: logEvent - dbInstance.run operation finished (async)');
}