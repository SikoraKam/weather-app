export const calculateMode = (arr: number[]) => {
  let item = arr[0];
  let occurrencesMap: any = {};

  for (let i in arr) {
    const current = arr[i];

    if (occurrencesMap[current]) occurrencesMap[current]++;
    else occurrencesMap[current] = 1;

    if (occurrencesMap[item] < occurrencesMap[current]) item = current;
  }

  return item;
};
