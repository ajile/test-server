import { fill } from './string';

export function zerofill(value, length) {
  return fill(value.toString(), length, "0", "left");
}