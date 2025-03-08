type MonthObject = {
  index: number;
  name: string;
};

const monthArray: MonthObject[] = [
  {
    index: 0,
    name: 'January',
  },
  {
    index: 1,
    name: 'February',
  },
  {
    index: 2,
    name: 'March',
  },
  {
    index: 3,
    name: 'April',
  },
  {
    index: 4,
    name: 'May',
  },
  {
    index: 5,
    name: 'June',
  },
  {
    index: 6,
    name: 'July',
  },
  {
    index: 7,
    name: 'August',
  },
  {
    index: 8,
    name: 'September',
  },
  {
    index: 9,
    name: 'October',
  },
  {
    index: 10,
    name: 'November',
  },
  {
    index: 11,
    name: 'December',
  },
];

const getMonthName = (index: number) => {
  for (let i = 0; i < monthArray.length; i++) {
    if (index === i) {
      return monthArray[i].name;
    }
  }
  return '';
};

function getFormattedDate(date: Date | null): string {
  if (null === date) {
    return '';
  }

  const year = date.getFullYear();
  const month = getMonthName(date.getMonth());
  const day = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;

  return `${month} ${day}, ${year}`;
}

export { getFormattedDate };
