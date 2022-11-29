import ProcessorProvider from '../player/processor-provider';
import SverigesRadioApiClient from '../sveriges-radio/sveriges-radio-api-client';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const processor = new ProcessorProvider(new SverigesRadioApiClient());
  await processor.printProcessorCommands();
  setTimeout(() => {
    processor.resetProcessor();
  }, 1_000);
})();
