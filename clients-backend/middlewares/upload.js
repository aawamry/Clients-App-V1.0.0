// middleware/upload.js
import multer from 'multer';

const upload = multer({ dest: 'uploads/' }); // or memoryStorage() for temp
export default upload;
