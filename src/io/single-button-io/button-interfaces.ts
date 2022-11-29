export interface ButtonLog {
  date: Date;
  state: SingleButtonState;
}

export type SingleButtonState = 'PRESSED' | 'RELEASED';
