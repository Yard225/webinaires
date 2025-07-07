import { Module } from '@nestjs/common';
import { WebinaireController } from './controllers/webinaire.controller';
import { OrganizeWebinaire } from './usecases/organize-webinaire';
import { I_WEBINAIRE_REPOSITORY } from './ports/user-repository.interface';
import { CommonModule } from '../core/common.module';
import { I_ID_GENERATOR } from '../core/ports/id-generator.interface';
import { I_DATE_GENERATOR } from '../core/ports/date-generator.interface';
import { InMemoryWebinaireRepository } from './adapters/in-memory-webinaire.repository';

@Module({
  imports: [CommonModule],
  controllers: [WebinaireController],
  providers: [
    {
      provide: I_WEBINAIRE_REPOSITORY,
      useFactory: () => {
        return new InMemoryWebinaireRepository();
      },
    },
    {
      provide: OrganizeWebinaire,
      inject: [I_WEBINAIRE_REPOSITORY, I_ID_GENERATOR, I_DATE_GENERATOR],
      useFactory: (repository, idGenerator, dateGenerator) => {
        return new OrganizeWebinaire(repository, idGenerator, dateGenerator);
      },
    },
  ],
  exports: [I_WEBINAIRE_REPOSITORY],
})
export class WebinaireModule {}
