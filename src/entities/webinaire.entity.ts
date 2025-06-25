import { differenceInDays } from 'date-fns';

type WebinaireProps = {
  id: string;
  title: string;
  seats: number;
  startDate: Date;
  endDate: Date;
};

export class Webinaire {
  constructor(public props: WebinaireProps) {}

  /* Logique Métier - Règle de gestion */
  isTooclose(actualDate: Date): boolean {
    const diff = differenceInDays(this.props.startDate, actualDate);
    return diff < 3;
  }

  hasTooManySeats(): boolean {
    return this.props.seats > 1000;
  }

  hasNoSeats(): boolean {
    return this.props.seats < 1;
  }
}
