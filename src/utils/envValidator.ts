import dotenv from 'dotenv';
import dotenvSafe from 'dotenv-safe';

// Load environment variables and ensure required keys are present
dotenv.config();
// .env.example should list required vars
dotenvSafe.config({
  allowEmptyValues: false,
  example: '.env.example',
});
