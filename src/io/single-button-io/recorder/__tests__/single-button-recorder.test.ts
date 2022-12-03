import SingleButtonRecorder from '../single-button-recorder';
import { LONG_THRESHOLD } from '../../interpreter/button-interpreter';

describe('SingleButtonRecorder', () => {
  let recorder: SingleButtonRecorder;
  let start_ts: number;

  beforeEach(() => {
    jest.useFakeTimers();
    start_ts = new Date().getTime();
  });

  beforeEach(() => {
    recorder = new SingleButtonRecorder();
  });

  describe('logButtonInteraction', () => {
    describe('with the same entry twice', () => {
      beforeEach(() => {
        recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(200);
      });
      it('should ignore duplicate actions and throw', () => {
        expect(() => recorder.logButtonInteraction('RELEASED')).toThrow();
        expect(recorder.getLog()).toEqual([
          { state: 'RELEASED', date: new Date(start_ts + 2) },
          { state: 'PRESSED', date: new Date(start_ts) },
        ]);
      });
    });
    describe('with more than 50 registered interactions', () => {
      beforeEach(() => {
        for (let i = 0; i < 100; i++) {
          recorder.logButtonInteraction('PRESSED');
          jest.advanceTimersByTime(2);
          recorder.logButtonInteraction('RELEASED');
          jest.advanceTimersByTime(2);
        }
      });
      it('should never store more than 50 events', () => {
        expect(recorder.getLog().length).toEqual(50);
      });
    });
  });
  describe('getLog', () => {
    describe('without history', () => {
      it('should return an empty array', () => {
        expect(recorder.getLog()).toEqual([]);
      });
    });
    describe('with one entry', () => {
      it('should return an array with one entry', () => {
        recorder.logButtonInteraction('PRESSED');
        expect(recorder.getLog()).toEqual([{ state: 'PRESSED', date: new Date(start_ts) }]);
      });
    });
    describe('with two entries', () => {
      beforeEach(() => {
        recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(500);
      });
      it('should return an array with one entry', () => {
        expect(recorder.getLog()).toEqual([
          { state: 'RELEASED', date: new Date(start_ts + 2) },
          { state: 'PRESSED', date: new Date(start_ts) },
        ]);
      });
    });
    describe('with a "long release"', () => {
      beforeEach(() => {
        recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(LONG_THRESHOLD);
        recorder.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(3);
        recorder.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(LONG_THRESHOLD);
      });
      it('should return an array with one entry', () => {
        expect(recorder.getLog()).toEqual([
          {
            date: new Date(start_ts + LONG_THRESHOLD + 5),
            state: 'RELEASED',
          },
          {
            date: new Date(start_ts + LONG_THRESHOLD + 2),
            state: 'PRESSED',
          },
          {
            date: new Date(start_ts + 2),
            state: 'RELEASED',
          },
          {
            date: new Date(start_ts),
            state: 'PRESSED',
          },
        ]);
      });
    });
  });
});
