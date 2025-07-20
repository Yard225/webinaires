import {
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { WebinaireAPI } from '../contracts';
import { User } from '../../users/entities/user.entity';
import { ReserveSeat } from '../usecases/reserve-seat';
import { CancelSeat } from '../usecases/cancel-seat';

@Controller('webinaires')
export class ParticipationController {
  constructor(
    private readonly reserveSeat: ReserveSeat,
    private readonly cancelSeat: CancelSeat,
  ) {}

  @Post('/:id/participations')
  @HttpCode(201)
  async handleReserveSeat(
    @Param('id') id: string,
    @Request() request: { user: User },
  ): Promise<WebinaireAPI.ReserveSeat.Response> {
    return this.reserveSeat.execute({
      user: request.user,
      webinaireId: id,
    });
  }

  @Delete('/:id/participations')
  @HttpCode(200)
  async handleCancelSeat(
    @Param('id') id: string,
    @Request() request: { user: User },
  ): Promise<WebinaireAPI.CancelSeat.Response> {
    return this.cancelSeat.execute({
      user: request.user,
      webinaireId: id,
    });
  }
}
