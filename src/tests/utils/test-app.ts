import { Test } from '@nestjs/testing';
import { AppModule } from '../../core/app.module';
import { INestApplication } from '@nestjs/common';
import { IFixture } from '../fixtures/fixture.interface';

export class TestApp {
  private app: INestApplication;

  async setup() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = module.createNestApplication();
    this.app.init();
  }

  async cleanup() {
    return this.app.close();
  }

  async loadFixtures(fixtures: IFixture[]) {
    Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }

  get<T>(name: string) {
    return this.app.get<T>(name);
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }
}
