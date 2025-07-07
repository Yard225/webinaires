import { v4 } from 'uuid';
import { IIDGenerator } from '../ports/id-generator.interface';

export class FixedIDGenerator implements IIDGenerator {
  generate(): string {
    return 'id-1';
  }
}
