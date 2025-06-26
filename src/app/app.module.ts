import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CurrentDateGenerator } from '../adapters/current-date-generator';
import { RandomIDGenerator } from '../adapters/random-id-generator';
import { InMemoryWebinaireRepository } from '../adapters/in-memory-webinaire.repository';
import { OrganizeWebinaire } from '../usecases/organize-webinaire';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    CurrentDateGenerator,
    RandomIDGenerator,
    InMemoryWebinaireRepository,
    {
      //les usescase ne sont pas perçus par NestJs
      // donc faudra procéder de cette manière afin qu'il les prenne en compte.
      provide: OrganizeWebinaire, //fournir le usecase
      inject: [
        InMemoryWebinaireRepository, //injection des dépendances
        RandomIDGenerator,
        CurrentDateGenerator,
      ],
      useFactory: (repository, idGenerator, dateGenerator) => {
        return new OrganizeWebinaire(repository, idGenerator, dateGenerator); //création d'une factory que l'on charge avec ses dépendances. Ps: respectez le même order que dans le test unittaire
      },
    },
  ],
})
export class AppModule {}
