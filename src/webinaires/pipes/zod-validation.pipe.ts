import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.Schema<any>) {}

  transform(payload: any) {
    const resultat = this.schema.safeParse(payload);

    if (resultat.success === true) {
      return resultat.data;
    }

    throw new BadRequestException('Failed to validate');
  }
}
