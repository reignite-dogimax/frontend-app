const fs = require('fs');
const path = require('path');
require('dotenv').config();

const targetPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${process.env.VITE_API_URL}',
  appointmentsEndpoint: '${process.env.VITE_APPOINTMENTS_ENDPOINT}',
  veterinariesEndpoint: '${process.env.VITE_VETERINARIES_ENDPOINT}',
  petsEndpoint: '${process.env.VITE_PETS_ENDPOINT}',
  medicalHistoriesEndpoint: '${process.env.VITE_MEDICAL_HISTORIES_ENDPOINT}',
  recommendationsEndpoint: '${process.env.VITE_RECOMMENDATIONS_ENDPOINT}',
  notificationsEndpoint: '${process.env.VITE_NOTIFICATIONS_ENDPOINT}',
  n8nWebhookUrl: '${process.env.VITE_N8N_WEBHOOK_URL}'
};
`;

fs.writeFileSync(targetPath, envConfigFile);
console.log('✅ Environment file generated successfully at:', targetPath);
console.log('📝 Using environment variables from .env file');
