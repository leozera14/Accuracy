
import { Router } from 'express';

import InventoryController from './controllers/InventoryController';
import ProductController from './controllers/ProductController';
import UserController from './controllers/UserController';

const routes = new Router();

routes.post('/inventory', InventoryController.store);
routes.get('/inventory', InventoryController.index);
routes.get('/inventoryGroup', InventoryController.indexGroup);
routes.delete('/inventory', InventoryController.delete);

routes.get('/users', UserController.index);
routes.post('/users/register', UserController.create);
routes.post('/users/login', UserController.login);


routes.post('/product', ProductController.store);
routes.get('/product', ProductController.index);

export default routes;