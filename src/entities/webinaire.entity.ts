type WebinaireProps = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
};

export class Webinaire {
  constructor(public props: WebinaireProps) {}
}
