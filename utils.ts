export const clamp = (start, end, x) => Math.max(start, Math.min(end, x));

export const arrConcat = (...arrs: any[]) =>
  arrs.reduce((acc, cur) => [...acc, ...cur], []);
