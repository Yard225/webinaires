import { Module } from '@nestjs/common';
import { I_USER_REPOSITORY } from './ports/user-repository.interface';
import { InMemoryUserRepository } from './adapters/in-memory-user.repository';
import { Authenticator } from './services/authenticator';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoUser } from './adapters/mongo/mongo-user';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MongoUser.CollectionName,
        schema: MongoUser.Schema,
      },
    ]),
  ],
  controllers: [],
  providers: [
    {
      provide: I_USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
    {
      provide: Authenticator,
      inject: [I_USER_REPOSITORY],
      useFactory: (repository) => {
        return new Authenticator(repository);
      },
    },
  ],
  exports: [I_USER_REPOSITORY],
})
export class UserModule {}
