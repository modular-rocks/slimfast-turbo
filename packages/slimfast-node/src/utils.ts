export function unique(arr: any[]) {
  if (!Array.isArray(arr)) {
    throw new TypeError('expected an array');
  }

  const len = arr.length;

  for (let i = 0; i < len; i += 1) {
    for (let j = i + 1; j < arr.length; j += 1) {
      if (arr[i] === arr[j]) {
        arr.splice(j, 1);
        j -= 1;
      }
    }
  }
  return arr;
}

export function uniqueImmutable(arr: any[]) {
  if (!Array.isArray(arr)) {
    throw new TypeError('expected an array');
  }

  const newArr = new Array(arr.length);

  for (let i = 0; i < arr.length; i += 1) {
    newArr[i] = arr[i];
  }

  return unique(newArr);
}
