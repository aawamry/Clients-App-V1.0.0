import { logEvent } from '../utilities/logger.js';

export default async function handleException(error, req, res, next) {
  console.error(`❌ errorHandler.js - Uncaught Error:`, error.message);
    console.log(`🔍 errorHandler.js - Request URL: ${req.originalUrl}, Method: ${req.method}`);
    console.log(`🔍 errorHandler.js - Headers Sent Status: ${res.headersSent}`);

  try {
    await logEvent({
      type: 'error',
      subject: req.originalUrl,
      message: error.message,
      user_id: req.user?.id || null,
      extra_data: {
        stack: error.stack,
        method: req.method,
        body: req.body,
        query: req.query,
      }
    });
    console.log('📝 Error logged.');
  } catch (logErr) {
    console.error('❌ Logger failed to log error:', logErr.message);
  }

  if (!res.headersSent) {
    console.log(`✅ errorHandler.js - Sending error response with status ${error.status || 500}.`);
    return res.status(error.status || 500).json({
      error: error.message || 'Internal Server Error'
    });
  }
}