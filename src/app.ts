import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from './config';
import { Routes } from '@interfaces/routes.interface';
// import { logger, stream } from '@utils/logger';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { logger } from './utils/logger';

// Add this block to catch uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    console.log('Initializing app...');
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    console.log('Initializing routes...');
    this.initializeRoutes(routes);
    console.log('Initializing Swagger...');    // this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    try {
      this.app.listen(this.port, () => {
        logger.info(`🚀 App listening on the port ${this.port}`);
      });
    } catch (error) {
      logger.error('Error starting the server:', error);
    }
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    try {
      this.app.use(morgan(LOG_FORMAT));  // Add this line to log requests
      this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(compression());
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: true }));
      this.app.use(cookieParser());
    } catch (error) {
      logger.error(error);
    }
  }

  private initializeRoutes(routes: Routes[]) {
    // Add this route to respond with "All good" at the root URL
    this.app.get('/', (req, res) => {
      res.send('All good');
    });
    
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
