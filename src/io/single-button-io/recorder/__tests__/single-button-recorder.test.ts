import { LONG_THRESHOLD } from '../../interpreter/button-sequence-interpreter';
import SingleButtonRecorder from '../single-button-recorder';

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
        expect(recorder.getRawLog()).toEqual([
          { state: 'RELEASED', date: new Date(start_ts + 2) },
          { state: 'PRESSED', date: new Date(start_ts) },
        ]);
        expect(recorder.getButtonSequence()).toEqual(['SHORT_OPEN', 'TAP']);
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
        expect(recorder.getRawLog().length).toEqual(50);
        expect(recorder.getButtonSequence().length).toEqual(50);
      });
    });
  });
  describe('getLog, getButtonSequence', () => {
    describe('without history', () => {
      it('should return an empty array', () => {
        expect(recorder.getRawLog()).toEqual([]);
        expect(recorder.getButtonSequence()).toEqual([]);
      });
    });
    describe('with one entry', () => {
      it('should return an array with one entry', () => {
        recorder.logButtonInteraction('PRESSED');
        expect(recorder.getRawLog()).toEqual([{ state: 'PRESSED', date: new Date(start_ts) }]);
        expect(recorder.getButtonSequence()).toEqual(['TAP']);
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
        expect(recorder.getRawLog()).toEqual([
          { state: 'RELEASED', date: new Date(start_ts + 2) },
          { state: 'PRESSED', date: new Date(start_ts) },
        ]);
        expect(recorder.getButtonSequence()).toEqual(['SHORT_OPEN', 'TAP']);
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
        expect(recorder.getRawLog()).toEqual([
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
        expect(recorder.getButtonSequence()).toEqual(['OPEN', 'TAP', 'OPEN', 'TAP']);
      });
    });
  });
});
