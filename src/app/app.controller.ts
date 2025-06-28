import { Body, Request, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { OrganizeWebinaire } from '../webinaires/usecases/organize-webinaire';
import { ZodValidationPipe } from '../webinaires/pipes/zod-validation.pipe';
import { WebinaireAPI } from './contract';
import { User } from '../users/entities/user.entity';
import { request } from 'http';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly organizeWebinaire: OrganizeWebinaire,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/webinaires')
  @HttpCode(201)
  handleOrganizeWebinaire(
    @Body(new ZodValidationPipe(WebinaireAPI.OrganizeWebinaire.schema))
    body: WebinaireAPI.OrganizeWebinaire.Request,
    @Request() request: { user: User },
  ): Promise<WebinaireAPI.OrganizeWebinaire.Response> {
    return this.organizeWebinaire.execute({
      user: request.user,
      title: body.title,
      seats: body.seats,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }
}
