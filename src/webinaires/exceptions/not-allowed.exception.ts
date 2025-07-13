import { DomainException } from '../../shared/exception';

export class ItNotAllowed extends DomainException {
  constructor() {
    super('You are not allowed to update this webinaire');
  }
}
