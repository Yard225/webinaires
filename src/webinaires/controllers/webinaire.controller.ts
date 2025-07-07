import { Body, Controller, Post, Request } from '@nestjs/common';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { WebinaireApi } from '../contracts';
import { OrganizeWebinaire } from '../usecases/organize-webinaire';
import { User } from '../../users/entities/user.entity';

@Controller()
export class WebinaireController {
  constructor(private readonly organizeWebinaire: OrganizeWebinaire) {}

  @Post('/webinaires')
  handleOrganizeWebinaire(
    @Body(new ZodValidationPipe(WebinaireApi.OrganizeWebinaire.schema))
    body: WebinaireApi.OrganizeWebinaire.Request,
    @Request() request: { user: User },
  ): Promise<WebinaireApi.OrganizeWebinaire.Response> {
    return this.organizeWebinaire.execute({
      user: request.user,
      title: body.title,
      seats: body.seats,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }
}
