import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common.module';
import { WebinaireModule } from '../webinaires/webinaire.module';
import { UserModule } from '../users/user.module';
import { Authenticator } from '../users/services/authenticator';
import { I_USER_REPOSITORY } from '../users/ports/user-repository.interface';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { OrganizeWebinaire } from '../webinaires/usecases/organize-webinaire';

@Module({
  imports: [UserModule, WebinaireModule, CommonModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: Authenticator,
      inject: [I_USER_REPOSITORY],
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
  exports: [],
})
export class AppModule {}
