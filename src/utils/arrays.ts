export function compareArrays<T>(
  left: T[],
  right: T[],
): {
  shared: T[];
  uniqueToLeft: T[];
  uniqueToRight: T[];
} {
  const shared = left.filter(value => right.includes(value));
  const uniqueToLeft = left.filter(value => !right.includes(value));
  const uniqueToRight = right.filter(value => !left.includes(value));

  return {
    shared,
    uniqueToLeft,
    uniqueToRight,
  };
}
