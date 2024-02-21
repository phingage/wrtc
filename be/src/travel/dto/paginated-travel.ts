import { ObjectType } from '@nestjs/graphql';
import { Travel } from '../entities/travel.entity';
import { Paginated } from '../../shared/pagination/types/paginated';

@ObjectType()
export class PaginatedTravel extends Paginated(Travel) {}
