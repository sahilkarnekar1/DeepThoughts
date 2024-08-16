require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { connectDB } = require('./services/dbService'); // Import connectDB
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
connectDB().then(() => {
  console.log('Connected to MongoDB');
  
  // Middlewares
  app.use(bodyParser.json());
  app.use(upload.single('files[image]'));
  app.use('/api/v3/app', eventRoutes);

  // Start server only after DB connection is established
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
});
