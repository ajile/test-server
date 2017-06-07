export function fill(value, length=2, filler="0", position="left") {
  var fillLength;
  length = length >> 0;
  value = value.toString();
  filler = filler.toString();
  fillLength = length - value.length + 1;
  filler = fillLength > 0 ? new Array(fillLength).join(filler) : '';
  return position === 'left' ? filler + value : value + filler;
}