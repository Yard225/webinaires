import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RandomIDGenerator } from '../webinaires/adapters/random-id-generator';
import { CurrentDateGenerator } from '../webinaires/adapters/current-date-generator';
import { InMemoryWebinaireRepository } from '../webinaires/adapters/in-memory-webinaire.repository';
import { OrganizeWebinaire } from '../webinaires/usecases/organize-webinaire';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    RandomIDGenerator,
    CurrentDateGenerator,
    InMemoryWebinaireRepository,
    {
      provide: OrganizeWebinaire,
      inject: [
        InMemoryWebinaireRepository,
        RandomIDGenerator,
        CurrentDateGenerator,
      ],
      useFactory: (repository, idGenerator, dateGenerator) => {
        return new OrganizeWebinaire(repository, idGenerator, dateGenerator);
      },
    },
  ],
})
export class AppModule {}
