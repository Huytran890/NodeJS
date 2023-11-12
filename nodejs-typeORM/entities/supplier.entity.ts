import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Product } from './product.entity';

@Entity({ name: 'Suppliers' })
export class Supplier {
  @PrimaryGeneratedColumn({ name: 'Id', type: 'int' })
  id: number;

  @Column({ name: 'Name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'Phone', type: 'varchar', length: 50, unique: true, default: '' })
  phoneNumber: string;

  @Column({ name: 'Email', type: 'varchar', length: 100, unique: true, default: '' })
  email: string;

  @Column({ name: 'Address', type: 'varchar', length: 500, default: '' })
  address: string;

  @OneToMany(() => Product, (p) => p.supplier)
  products: Product[];
}
