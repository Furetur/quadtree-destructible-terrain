type Point = [number, number];

export const x = point => point[0];

export const y = point => point[1];

export const squaredDistance = (p1: Point, p2: Point) =>
  (x(p1) - x(p2)) ** 2 + (y(p1) - y(p2)) ** 2;

export const distance = (p1: Point, p2: Point) =>
  Math.sqrt(squaredDistance(p1, p2));

export const equals = ([x1, y1]: Point, [x2, y2]: Point) =>
  x1 === x2 && y1 === y2;

export default Point;
