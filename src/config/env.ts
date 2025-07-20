import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

// Validation optionnelle des variables requises
const requiredVariables = ['API_KEY', 'PORT'];
requiredVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`La variable ${variable} est manquante dans .env`);
  }
});
