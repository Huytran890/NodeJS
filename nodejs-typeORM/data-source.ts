require('dotenv').config();
import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { Category } from './entities/category.entity';
import { Supplier } from './entities/supplier.entity';
import { Customer } from './entities/customer.entity';
import { Employee } from './entities/employee.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-details.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Snowpop8900',
  database: 'type_orm',
  entities: ['entities/**/*.entity{.ts,.js}', 'entities/**/*.schema{.ts,.js}'],
  // entities: [Category, Supplier, Customer, Employee, Product, Order, OrderDetail],
  logging: false,
  // synchronize: true,
  migrationsRun: true,
  // options: {
  //     encrypt: false,
  // },
});
