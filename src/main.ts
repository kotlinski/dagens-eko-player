type Hardware = 'mac' | 'pi';

export async function startRadio(hardware: Hardware) {
  // eslint-disable-next-line no-console
  console.log(`Started radio on ${hardware}`);

  /*  const input = await fetchTaskInputData(day);
  const file = `./2021/day-${day.toString().padStart(2, '0')}/solver.ts`;
  const { default: solver } = await import(file);
  return solverFactory(solver, input);*/
}

export function parseInput(input: string): { hardware: Hardware } {
  if (input === 'mac') {
    return { hardware: 'mac' };
  }
  if (input === 'pi') {
    return { hardware: 'pi' };
  }
  throw new Error('could not verify hardware');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  // eslint-disable-next-line no-console
  console.log('starting...');
  const { hardware } = parseInput(process.argv[2]);
  await startRadio(hardware);
  // eslint-disable-next-line no-console
  console.log(`Closing down broadcast.`);
})();
