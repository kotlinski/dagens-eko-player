export interface ButtonLog {
  date: Date;
  state: ButtonState;
}

export type ButtonState = 'PRESSED' | 'RELEASED';
