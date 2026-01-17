import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Resume Program API',
      version: '1.0.0',
      description: 'API documentation for the Resume Program application.\n\n**Authentication:** Click the green "Authorize" button at the top right and paste your Supabase Access Token (JWT) to test secured endpoints.',
    },
    servers: [
      {
        url: 'http://localhost:5002/api',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
