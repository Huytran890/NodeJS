import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'Employees' })
export class Employee {
  // ID
  @PrimaryGeneratedColumn({ name: 'Id' })
  id: number;

  // FIRST NAME
  @Column({ name: 'FirstName', type: 'varchar', length: 50 })
  firstName: string;

  // LAST NAME
  @Column({ name: 'LastName', type: 'varchar', length: 50 })
  lastName: string;

  // PHONE NUMBER
  @Column({ name: 'PhoneNumber', length: 15, type: 'varchar', unique: true })
  phoneNumber: string;

  // ADDRESS
  @Column({ name: 'Address', type: 'varchar', length: 500 })
  address: string;

  // BIRTHDAY
  @Column({ name: 'Birthday', type: 'date', nullable: true })
  birthday: Date;

  // EMAIL
  @Column({ name: 'Email', unique: true, length: 50, type: 'varchar' })
  email: string;

  // ORDERS
  @OneToMany(() => Order, (o) => o.customer)
  orders: Order[];
}
