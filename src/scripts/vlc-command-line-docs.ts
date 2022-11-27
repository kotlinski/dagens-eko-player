import ProcessorProvider from '../player/processor-provider';
import SverigesRadioApiClient from '../sveriges-radio/sveriges-radio-api-client';

const pp = new ProcessorProvider(new SverigesRadioApiClient());

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await pp.printProcessorCommands();
})();
