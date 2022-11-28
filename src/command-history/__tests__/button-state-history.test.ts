import ButtonLogger, { LONG_THRESHOLD } from '../button-logger';

describe('ButtonLogger', () => {
  let log: ButtonLogger;
  let start_ts: number;

  beforeEach(() => {
    jest.useFakeTimers();
    start_ts = new Date().getTime();
  });

  beforeEach(() => {
    log = new ButtonLogger();
  });

  describe('getLog', () => {
    describe('without history', () => {
      it('should return an empty array', () => {
        expect(log.getLog()).toEqual([]);
      });
    });
    describe('with one entry', () => {
      it('should return an array with one entry', () => {
        log.logButtonInteraction('PRESSED');
        expect(log.getLog()).toEqual([{ state: 'PRESSED', date: new Date(start_ts) }]);
      });
    });
    describe('with two entries', () => {
      beforeEach(() => {
        log.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        log.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(500);
      });
      it('should return an array with one entry', () => {
        expect(log.getLog()).toEqual([
          { state: 'RELEASED', date: new Date(start_ts + 2) },
          { state: 'PRESSED', date: new Date(start_ts) },
        ]);
      });
    });
    describe('with a "long release"', () => {
      beforeEach(() => {
        log.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        log.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(LONG_THRESHOLD);
        log.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(3);
        log.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(LONG_THRESHOLD);
      });
      it('should return an array with one entry', () => {
        expect(log.getLog()).toEqual([
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
    describe('with the same entry twice', function () {
      beforeEach(() => {
        log.logButtonInteraction('PRESSED');
        jest.advanceTimersByTime(2);
        log.logButtonInteraction('RELEASED');
        jest.advanceTimersByTime(200);
        try {
          log.logButtonInteraction('RELEASED');
        } catch (e) {
          // ignore this
        }
      });
      it('should ignore duplicate actions', () => {
        expect(log.getLog()).toEqual([
          { state: 'RELEASED', date: new Date(start_ts + 2) },
          { state: 'PRESSED', date: new Date(start_ts) },
        ]);
      });
    });
  });
});
