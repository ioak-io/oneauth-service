export function isEmptyOrSpaces(str: any) {
  return !str || str.match(/^ *$/) !== null;
}

export function isEmptyAttributes(object: Record<string, any>) {
  if (!object) {
    return true;
  }

  return !Object.keys(object).find((key) => {
    if (object[key]) {
      return true;
    }
    return false;
  });
}

export function match(text: string, words: string) {
  let found = false;
  if (words) {
    words.split(' ').forEach((word) => {
      if (text.toString().match(new RegExp(`(\\w*${word}\\w*)`, 'gi'))) {
        found = true;
      }
    });
  }
  return found;
}

export function sort(
  array: any[],
  property: string | number,
  isReverseOrder: boolean
) {
  const result = array.sort(function (o1, o2) {
    if (isReverseOrder) {
      return o1[property] > o2[property]
        ? -1
        : o1[property] < o2[property]
        ? 1
        : 0;
    }
    return o1[property] < o2[property]
      ? -1
      : o1[property] > o2[property]
      ? 1
      : 0;
  });

  return result;
}

export function htmlToText(str?: string | null) {
  if (!str) return false;
  str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, '');
}
