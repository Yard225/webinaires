export abstract class BaseEntity<T> {
  public initialState: T;
  public props: T;

  constructor(data: T) {
    this.props = { ...data };
    this.initialState = { ...data };

    Object.freeze(this.initialState);
  }

  update(data: Partial<T>): void {
    this.props = { ...this.props, ...data };
  }

  commit(): void {
    this.initialState = this.props;
  }
}
