require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3333;


process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION Desligando o servidor...');
  console.error(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION');
  console.error(err.name, err.message);
  process.exit(1);
});


connectDB().then(() =>{

  app.listen(PORT, () => {
    console.log(`Servidor iniciado ${PORT}`);
  });
});