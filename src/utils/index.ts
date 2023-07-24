export * from './wait-for-selector';
export * from './run';
export * from './arrays';

export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
