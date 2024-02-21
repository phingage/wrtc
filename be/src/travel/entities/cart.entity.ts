import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Travel } from './travel.entity';

export enum CartStatus {
  OPEN = 'open',
  EXPIRED = 'expired',
  CLOSED = 'closed',
}
@ObjectType()
@Entity('carts')
export class Cart {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Field()
  @Column({
    type: 'simple-enum',
    enum: CartStatus,
    default: CartStatus.OPEN,
  })
  status: CartStatus;
  @Field({ nullable: true })
  @Column({ nullable: true })
  cartPopulatedAt: Date;
  @Field()
  @Column({ nullable: false, default: 0 })
  seat: number;
  @Field(() => Travel, { nullable: true })
  @ManyToOne(() => Travel, (travel) => travel.carts)
  travel: Travel;
}
