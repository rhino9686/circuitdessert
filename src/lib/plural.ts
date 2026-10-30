/** "1 part", "2 parts". Pass `many` for an irregular plural. */
export const count = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
