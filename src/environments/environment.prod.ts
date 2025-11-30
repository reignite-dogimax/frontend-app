export const environment = {
  production: true,
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.dogimax.com',
  appointmentsEndpoint: import.meta.env.VITE_APPOINTMENTS_ENDPOINT || '/api/v1/appointments',
  veterinariesEndpoint: import.meta.env.VITE_VETERINARIES_ENDPOINT || '/api/v1/veterinarys',
  petsEndpoint: import.meta.env.VITE_PETS_ENDPOINT || '/api/v1/pets',
  medicalHistoriesEndpoint: import.meta.env.VITE_MEDICAL_HISTORIES_ENDPOINT || '/api/v1/medical-histories',
  recommendationsEndpoint: import.meta.env.VITE_RECOMMENDATIONS_ENDPOINT || '/api/v1/recommendations',
  notificationsEndpoint: import.meta.env.VITE_NOTIFICATIONS_ENDPOINT || '/api/v1/notifications',
  n8nWebhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://n8n.arroz.dev/webhook/7e7c2a22-3543-4208-b6f3-f65650db9a7f'
};