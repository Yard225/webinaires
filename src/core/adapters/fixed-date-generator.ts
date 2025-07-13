import { IDateGenerator } from '../ports/date-generator';

export class FixedDateGenerator implements IDateGenerator {
  now(): Date {
    return new Date('2025-01-01T10:00:00.000Z');
  }
}
