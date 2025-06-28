import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RandomIDGenerator } from '../webinaires/adapters/random-id-generator';
import { CurrentDateGenerator } from '../webinaires/adapters/current-date-generator';
import { InMemoryWebinaireRepository } from '../webinaires/adapters/in-memory-webinaire.repository';
import { OrganizeWebinaire } from '../webinaires/usecases/organize-webinaire';
import { InMemoryUserRepository } from '../core/adapters/in-memory-user.repository';
import { Authenticator } from '../core/services/authenticator';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    RandomIDGenerator,
    CurrentDateGenerator,
    InMemoryWebinaireRepository,
    InMemoryUserRepository,
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
    {
      provide: Authenticator,
      inject: [InMemoryUserRepository],
      useFactory: (repository) => {
        return new Authenticator(repository);
      },
    },
    {
      provide: APP_GUARD,
      inject: [Authenticator],
      useFactory: (authenticator) => {
        return new AuthGuard(authenticator);
      },
    },
  ],
})
export class AppModule {}
