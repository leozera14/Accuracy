import express from 'express';
import routes from './routes';
// import './database';

class App {
  constructor() {
    this.server = express();
    this.middleware();
    this.routes();
  }

  middleware() {
    this.server.use(express.json());
    this.server.use(express.urlencoded());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;