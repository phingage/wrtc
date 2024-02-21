import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Travel } from '../travel/entities/travel.entity';

interface TravelInput {
  id: string;
  slug: string;
  name: string;
  description: string;
  startingDate: string;
  endingDate: string;
  price: number;
  moods: {
    nature: number;
    relax: number;
    history: number;
    culture: number;
    party: number;
  };
}

export async function seedTravelData(dataSource: DataSource): Promise<void> {
  await dataSource.query('DELETE FROM travels;');
  const repository = dataSource.getRepository(Travel);
  const seedInfo = readFileSync(
    join(process.cwd(), 'src/seeders/seeds/travels.json'),
    'utf-8',
  );
  const travels: TravelInput[] = JSON.parse(seedInfo);
  for (const travel of travels) {
    await repository.insert({
      slug: travel.slug,
      name: travel.name,
      description: travel.description,
      startingDate: new Date(travel.startingDate),
      endingDate: new Date(travel.endingDate),
      price: travel.price,
      nature: travel.moods.nature,
      relax: travel.moods.relax,
      history: travel.moods.history,
      culture: travel.moods.culture,
      party: travel.moods.party,
    });
  }
}
