import { Module } from '@nestjs/common';
import { I_ID_GENERATOR } from './ports/id-generator.interface';
import { RandomIDGenerator } from './adapters/random-id-generator';
import { I_DATE_GENERATOR } from './ports/date-generator.interface';
import { CurrentDateGenerator } from './adapters/current-date-generator';

@Module({
  controllers: [],
  providers: [
    {
      provide: I_ID_GENERATOR,
      useClass: RandomIDGenerator,
    },
    {
      provide: I_DATE_GENERATOR,
      useClass: CurrentDateGenerator,
    },
  ],
  exports: [I_ID_GENERATOR, I_DATE_GENERATOR],
})
export class CommonModule {}
