import { logEvent } from '../utilities/logger.js';

export default async function handleException(err, req, res, next) {
  console.error(`❌ errorHandler.js - Uncaught Error:, ${err.message}`);

  try {
    await logEvent({
      type: 'error',
      subject: req.originalUrl,
      message: err.message,
      user_id: req.user?.id || null,
      extra_data: {
        stack: err.stack,
        method: req.method,
        body: req.body,
        query: req.query,
      }
    });
  } catch (logErr) {
    console.error('❌ Logger failed to log error:', logErr.message);
  }

  // ✅ Make sure response is always sent
  if (!res.headersSent) {
		res.status(err.status || 500).json({
			error: err.message || 'Internal Server Error'
		});
  }
}
