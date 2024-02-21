import { DataSource } from 'typeorm';
import { seedTravelData } from './travel.seeder';
import { AppModule } from '../app.module';
import { NestFactory } from '@nestjs/core';

async function runSeeder() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  await seedTravelData(dataSource);
  await app.close();
}
runSeeder();
