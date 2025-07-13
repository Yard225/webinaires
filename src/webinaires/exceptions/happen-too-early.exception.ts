import { DomainException } from '../../shared/exception';

export class HappenTooEarlyException extends DomainException {
  constructor() {
    super('The webinaire must happens in at least 3 days');
  }
}
