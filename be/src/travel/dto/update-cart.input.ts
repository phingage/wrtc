import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCartInput {
  @Field(() => String)
  id: string;
  @Field(() => Int)
  travelId: number;
  @Field(() => Int)
  seats: number;
}
