import moment from 'moment';

export const getWeekTitle = (nowUnix: number) => {
  const nowMoment = moment.unix(nowUnix);
  const YearStr = nowMoment.format('YYYY');
  const firstDayOfYear = nowMoment.startOf('year');
  const firstDayOfYearStartWeekday = moment(firstDayOfYear)
    .startOf('week')
    .add(1, 'day');
  const count = Math.ceil(
    (nowUnix - firstDayOfYearStartWeekday.unix()) / (86400 * 7)
  );
  const dateArray = new Array(count)
    .fill('')
    .map((i, index) => firstDayOfYearStartWeekday.unix() + index * 86400 * 7);

  const Title = new Array(count).fill('').map((i, index) => ({
    title:
      index !== count - 1 && index !== count - 2
        ? `${YearStr}-${index + 1}周`
        : index === count - 2
        ? '上周'
        : '本周',
  }));
  return { Title, dateArray };
};

export const getMonthTitle = (nowUnix: number) => {
  return 2;
};

export const getYearTitle = (nowUnix: number) => {
  return 3;
};

export default ['', getWeekTitle, getMonthTitle, getYearTitle];
