import { Module } from '@nestjs/common';
import { WebinaireController } from './controllers/webinaire.controller';
import { OrganizeWebinaire } from './usecases/organize-webinaire';
import { I_WEBINAIRE_REPOSITORY } from './ports/webinaire-repository.interface';
import { InMemoryWebinaireRepository } from './adapters/in-memory-webinaire.repository';
import { CommonModule } from '../core/common.module';
import { I_ID_GENERATOR } from '../core/ports/id-generator.interface';
import { I_DATE_GENERATOR } from '../core/ports/date-generator';
import { ChangeSeats } from './usecases/change-seats';
import { ChangeDates } from './usecases/change-dates';
import { I_PARTICIPATION_REPOSITORY } from './ports/participation-repository.interface';
import { I_USER_REPOSITORY } from '../users/ports/user-repository.interface';
import { I_MAILER } from '../core/ports/mailer.interface';
import { InMemoryParticipationRepository } from './adapters/in-memory-participation.repository';
import { UserModule } from '../users/user.module';
import { CancelWebinaire } from './usecases/cancel-webinaire';

@Module({
  imports: [CommonModule, UserModule],
  controllers: [WebinaireController],
  providers: [
    {
      provide: I_WEBINAIRE_REPOSITORY,
      useClass: InMemoryWebinaireRepository,
    },
    {
      provide: I_PARTICIPATION_REPOSITORY,
      useClass: InMemoryParticipationRepository,
    },
    {
      provide: OrganizeWebinaire,
      inject: [I_WEBINAIRE_REPOSITORY, I_ID_GENERATOR, I_DATE_GENERATOR],
      useFactory: (repository, idGenerator, dateGenerator) => {
        return new OrganizeWebinaire(repository, idGenerator, dateGenerator);
      },
    },
    {
      provide: ChangeSeats,
      inject: [I_WEBINAIRE_REPOSITORY],
      useFactory: (repository) => {
        return new ChangeSeats(repository);
      },
    },
    {
      provide: ChangeDates,
      inject: [
        I_WEBINAIRE_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
        I_USER_REPOSITORY,
        I_DATE_GENERATOR,
        I_MAILER,
      ],
      useFactory: (
        webinaireRepository,
        participationRepository,
        userRepository,
        dateGenerator,
        mailer,
      ) => {
        return new ChangeDates(
          webinaireRepository,
          participationRepository,
          userRepository,
          dateGenerator,
          mailer,
        );
      },
    },
    {
      provide: CancelWebinaire,
      inject: [
        I_WEBINAIRE_REPOSITORY,
        I_PARTICIPATION_REPOSITORY,
        I_USER_REPOSITORY,
        I_MAILER,
      ],
      useFactory: (
        webinaireRepository,
        participationRepository,
        userRepository,
        mailer,
      ) => {
        return new CancelWebinaire(
          webinaireRepository,
          participationRepository,
          userRepository,
          mailer,
        );
      },
    },
  ],
  exports: [],
})
export class WebinaireModule {}
