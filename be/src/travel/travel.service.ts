import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PaginationArgs } from '../shared/pagination/types/pagination.args';
import { PaginatedTravel } from './dto/paginated-travel';
import { And, IsNull, MoreThan, Not, Repository } from 'typeorm';
import { Travel } from './entities/travel.entity';
import { paginate } from '../shared/pagination/paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart, CartStatus } from './entities/cart.entity';
import { UpdateCartInput } from './dto/update-cart.input';
import { sumBy } from 'lodash';

@Injectable()
export class TravelService {
  private readonly logger = new Logger('TravelService');

  constructor(
    @InjectRepository(Travel)
    private travelRepository: Repository<Travel>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}
  async findAll(paginationArgs: PaginationArgs): Promise<PaginatedTravel> {
    const query = await this.travelRepository.createQueryBuilder().select();
    return paginate(query, paginationArgs);
  }
  //
  async createCart() {
    const newCart = await this.cartRepository.create();
    return await this.cartRepository.save(newCart);
  }

  async voidCart(cartId: string) {
    const cart = await this.checkCart(cartId);
    // @ts-expect-error typeorm suck with null type
    cart.travel = null;
    cart.seat = 0;
    // @ts-expect-error typeorm suck with null type
    cart.cartPopulatedAt = null;
    return await this.cartRepository.save(cart);
  }

  async closeCart(cartId: string) {
    const cart = await this.checkCart(cartId);
    if (cart.travel) {
      await this.checkSeats(cart.travel, 0);
    }
    cart.status = CartStatus.CLOSED;
    return await this.cartRepository.save(cart);
  }

  async updateCart(updateCartInput: UpdateCartInput) {
    const cart = await this.checkCart(updateCartInput.id);
    const travel = await this.travelRepository.findOne({
      where: {
        id: updateCartInput.travelId,
      },
    });
    if (!travel)
      throw new HttpException('Travel non existent', HttpStatus.BAD_REQUEST);
    if (cart.travel && cart.travel.id !== updateCartInput.travelId) {
      throw new HttpException('Only 1 Travel per cart', HttpStatus.BAD_REQUEST);
    }
    await this.checkSeats(travel, updateCartInput.seats - cart.seat);
    cart.travel = travel;
    cart.seat = updateCartInput.seats;
    if (!cart.cartPopulatedAt) cart.cartPopulatedAt = new Date();
    return await this.cartRepository.save(cart);
  }

  private async checkSeats(travel: Travel, seats: number) {
    const currentSeats = await this.countAvailableSeats(
      travel.id,
      travel.maxTravellers,
    );
    if (currentSeats < seats) {
      throw new HttpException(
        'Number of seats not available',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async countAvailableSeats(id: number, maxTravellers: number) {
    const maxAllowedDate = new Date();
    maxAllowedDate.setMinutes(maxAllowedDate.getMinutes() - 15);
    const carts = await this.cartRepository.find({
      where: [
        {
          travel: {
            id,
          },
          cartPopulatedAt: And(Not(IsNull()), MoreThan(maxAllowedDate)),
          status: CartStatus.OPEN,
        },
        {
          travel: {
            id,
          },
          status: CartStatus.CLOSED,
        },
      ],
      relations: ['travel'],
    });
    return maxTravellers - sumBy(carts, 'seat');
  }
  async findOneCart(id: string) {
    return await this.checkCart(id);
  }

  private async checkCart(id: string) {
    const cart = await this.cartRepository.findOne({
      where: {
        id: id,
      },
      relations: ['travel'],
    });
    if (!cart || cart.status === 'expired' || cart.status === 'closed')
      throw new HttpException(
        'Cart expired or non existent',
        HttpStatus.BAD_REQUEST,
      );
    if (cart.cartPopulatedAt) {
      const timeDiff = new Date().getTime() - cart.cartPopulatedAt.getTime();
      if (timeDiff > 1000 * 60 * 15) {
        cart.status = CartStatus.EXPIRED;
        await this.cartRepository.save(cart);
        throw new HttpException(
          'Cart expired or non existent',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return cart;
  }
}
