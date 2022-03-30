export const getDateFromTimestamp = (timestamp: number) => {
  const milliseconds = timestamp * 1000;

  const dateObject = new Date(milliseconds);
  const date_time = dateObject.toLocaleString();

  return date_time.split(" ")[0];
};
