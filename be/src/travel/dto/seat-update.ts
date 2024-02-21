import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SeatUpdate {
  @Field()
  id: number;
  @Field()
  availableSeats: number;
}
