export async function logEvent({
  type,
  subject,
  message,
  user_id = null,
  extra_data = null
}) {
  if (!type || typeof type !== 'string') {
    throw new Error('Logger.js - "type" is required and must be a string.');
  }

  const dbInstance = await initEventsLogDB();
  try {
    const result = await dbInstance.run(
      insertLogQuery,
      [
        type,
        subject,
        message,
        user_id,
        JSON.stringify(extra_data)
      ]
    );
    return { id: result.lastID };
  } catch (err) {
    console.error('❌ Logger.js - Logger Error:', err.message);
    throw err; // Always rethrow
  }
}
