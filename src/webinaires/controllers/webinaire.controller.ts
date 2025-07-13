import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { OrganizeWebinaire } from '../usecases/organize-webinaire';
import { ZodValidationPipe } from '../../core/pipes/zod-validation.pipe';
import { WebinaireAPI } from '../contracts';
import { User } from '../../users/entities/user.entity';
import { ChangeSeats } from '../usecases/change-seats';
import { ChangeDates } from '../usecases/change-dates';
import { CancelWebinaire } from '../usecases/cancel-webinaire';

@Controller('webinaires')
export class WebinaireController {
  constructor(
    private readonly organizeWebinaire: OrganizeWebinaire,
    private readonly changeSeats: ChangeSeats,
    private readonly changeDates: ChangeDates,
    private readonly cancelWebinaire: CancelWebinaire,
  ) {}

  @Post('/')
  @HttpCode(201)
  async handleOrganizeWebinaire(
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

  @Post('/:id/seats')
  @HttpCode(200)
  async handleChangeSeats(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(WebinaireAPI.ChangeSeats.schema))
    body: WebinaireAPI.ChangeSeats.Request,
    @Request() request: { user: User },
  ): Promise<WebinaireAPI.ChangeSeats.Response> {
    return this.changeSeats.execute({
      user: request.user,
      webinaireId: id,
      seats: body.seats,
    });
  }

  @Post('/:id/dates')
  @HttpCode(200)
  async handleChangeDates(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(WebinaireAPI.ChangeDates.schema))
    body: WebinaireAPI.ChangeDates.Request,
    @Request() request: { user: User },
  ): Promise<WebinaireAPI.ChangeDates.Response> {
    return this.changeDates.execute({
      user: request.user,
      webinaireId: id,
      startDate: body.startDate,
      endDate: body.startDate,
    });
  }

  @Delete('/:id')
  async handleCancelWebinaire(
    @Param('id') id: string,
    @Request() request: { user: User },
  ): Promise<WebinaireAPI.ChangeDates.Response> {
    return this.cancelWebinaire.execute({
      user: request.user,
      webinaireId: id,
    });
  }
}
