const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'University API',
    description: 'API for managing university data'
  },
  host: 'localhost:5500',
  schemes: ['http'],
};

const outputFile = './swagger.json'; // Output file for the generated Swagger documentation will be generated in the root directory
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);

  