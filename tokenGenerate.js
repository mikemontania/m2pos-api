require('dotenv').config();
const { generarJWTInfinito } = require('./src/helpers/jwt-helper-infinito');

const generaToken = async () => {
  try {
    const tokenInfinito = await generarJWTInfinito(9);
    console.log('TOKEN INFINITO:\n', tokenInfinito);
  } catch (error) {
    console.error('Error al generar token:', error);
  }
};

generaToken();
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo5LCJlbXByZXNhSWQiOjQsInN1Y3Vyc2FsSWQiOjMsIm51bVByZWZJZCI6NiwibnVtTmNQcmVmSWQiOjcsInVzZXJuYW1lIjoiYXV4aWxpYXJAY29tcHJheWEuY29tLnB5IiwidXN1YXJpbyI6IkF1eGlsaWFyIDEiLCJpbWciOiIiLCJyb2wiOiJ2ZW5kZWRvciJ9LCJpYXQiOjE3NjMwMzU4MjR9.b_yaG5RrLRxqaGvPBazK7mBdcL_TGIw0hNcQ-5_0sn8