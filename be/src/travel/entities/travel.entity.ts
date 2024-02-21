import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cart } from './cart.entity';

@ObjectType()
@Entity('travels')
export class Travel {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Field()
  @Column({ length: 500, nullable: false })
  slug: string;
  @Field()
  @Column({ length: 500, nullable: false })
  name: string;
  @Field()
  @Column('text', { nullable: false })
  description: string;
  @Field()
  @Column({ nullable: false })
  startingDate: Date;
  @Field()
  @Column({ nullable: false })
  endingDate: Date;
  @Field()
  @Column({ nullable: false })
  price: number;
  @Field()
  @Column({ nullable: false })
  nature: number;
  @Field()
  @Column({ nullable: false })
  relax: number;
  @Field()
  @Column({ nullable: false })
  history: number;
  @Field()
  @Column({ nullable: false })
  culture: number;
  @Field()
  @Column({ nullable: false })
  party: number;
  @Field()
  @Column({ nullable: false, default: 15 })
  maxTravellers: number;
  @OneToMany(() => Cart, (cart) => cart.travel)
  carts?: Cart[];
  @Field()
  availableSeats: number;
}
