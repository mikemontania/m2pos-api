const crypto = require('crypto');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

// Configura tu clave de encriptación (debe ser segura y protegida)
const encryptionKey = Buffer.from(process.env.ENCRYP_KEY, 'hex'); // Convierte la clave desde hexadecimal a un Buffer

// Función para encriptar el passphrase
const encryptPassphrase = (passphrase) => {
  const iv = crypto.randomBytes(16); // Genera un IV aleatorio
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  let encrypted = cipher.update(passphrase, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted; // Concatenar el IV con el texto cifrado
}

// Función para desencriptar el passphrase
const decryptPassphrase = (encryptedPassphrase) => {
  try {
    const parts = encryptedPassphrase.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted passphrase format');
    }
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    if (iv.length !== 16) {
      throw new Error('Invalid IV length');
    }
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Error al desencriptar el passphrase:', error);
    throw error;
  }
}

module.exports = { encryptPassphrase, decryptPassphrase };


// Ejemplo de uso
/*
const passphrase = 'my-secret-passphrase';
const encryptedPassphrase = encryptPassphrase(passphrase);
const decryptedPassphrase = decryptPassphrase(encryptedPassphrase);

*/