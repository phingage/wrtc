import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Parent,
  ResolveField,
  Subscription,
} from '@nestjs/graphql';
import { TravelService } from './travel.service';
import { Travel } from './entities/travel.entity';
import { UpdateCartInput } from './dto/update-cart.input';
import { PaginatedTravel } from './dto/paginated-travel';
import { PaginationArgs } from '../shared/pagination/types/pagination.args';
import { Cart } from './entities/cart.entity';
import { PubSub } from 'graphql-subscriptions';
import { SeatUpdate } from './dto/seat-update';
const pubSub = new PubSub();
@Resolver(() => Travel)
export class TravelResolver {
  constructor(private readonly travelService: TravelService) {}

  @Mutation(() => Cart)
  createCart() {
    return this.travelService.createCart();
  }

  @Mutation(() => Cart)
  async updateCart(@Args('updateCartInput') updateCartInput: UpdateCartInput) {
    const updatedCart = await this.travelService.updateCart(updateCartInput);
    if (updatedCart.travel) {
      const availableSeats = await this.travelService.countAvailableSeats(
        updatedCart.travel.id,
        updatedCart.travel.maxTravellers,
      );
      pubSub.publish('availableSeatsUpdated', {
        availableSeatsUpdated: {
          id: updatedCart.travel.id,
          availableSeats: availableSeats,
        },
      });
    }
    return updatedCart;
  }

  @Query(() => PaginatedTravel, { name: 'travels' })
  findAll(@Args() pagination: PaginationArgs) {
    return this.travelService.findAll(pagination);
  }
  @ResolveField()
  async availableSeats(@Parent() travel: Travel) {
    const { id, maxTravellers } = travel;
    return this.travelService.countAvailableSeats(id, maxTravellers);
  }

  @Query(() => Cart, { name: 'cart' })
  findOneCart(@Args('id', { type: () => String }) id: string) {
    return this.travelService.findOneCart(id);
  }

  @Subscription(() => SeatUpdate)
  availableSeatsUpdated() {
    return pubSub.asyncIterator('availableSeatsUpdated');
  }

  @Mutation(() => Cart)
  voidCart(@Args('id', { type: () => String }) id: string) {
    return this.travelService.voidCart(id);
  }

  @Mutation(() => Cart)
  closeCart(@Args('id', { type: () => String }) id: string) {
    return this.travelService.closeCart(id);
  }
}
