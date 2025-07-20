import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from '../../ports/user-repository.interface';
import { Model } from 'mongoose';
import { MongoUser } from './mongo-user';

export class MongoUserRepository implements IUserRepository {
  constructor(private readonly model: Model<MongoUser.Document>) {}

  async findByEmailAddress(emailAddress: string): Promise<User | null> {
    return this.model.find((user) => user)
  }

  async findById(id: string): Promise<User | null> {
    throw new Error('');
  }

  async findAll(): Promise<User[]> {
    throw new Error('');
  }

  async create(entity: User): Promise<void> {
    throw new Error('');
  }
}
