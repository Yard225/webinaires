import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { OrganizeWebinaire } from '../webinaires/usecases/organize-webinaire';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { WebinaireAPI } from '../webinaires/contracts';
import { User } from '../users/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
