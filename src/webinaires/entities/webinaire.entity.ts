import { BaseEntity } from '../../shared/entity';
import { differenceInDays } from 'date-fns';

type Props = {
  id: string;
  organizerId: string;
  title: string;
  seats: number;
  startDate: Date;
  endDate: Date;
};

export class Webinaire extends BaseEntity<Props> {
  itTooClose(now: Date): boolean {
    const diff = differenceInDays(this.props.startDate, now);
    return diff < 3;
  }

  maximumSeatReached(): boolean {
    return this.props.seats > 1000;
  }

  minimumSeatNotReached(): boolean {
    return this.props.seats < 1;
  }

  isOrganizer(userId: string): boolean {
    return this.props.organizerId === userId;
  }
}
