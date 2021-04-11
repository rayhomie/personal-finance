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
  const Title = new Array(count).fill('').map((i, index) => ({
    title:
      index !== count - 1 && index !== count - 2
        ? `${YearStr}-${index + 1}周`
        : index === count - 2
        ? '上周'
        : '本周',
    date: firstDayOfYearStartWeekday.unix() + index * 86400 * 7,
  }));
  return Title;
};

export const getMonthTitle = (nowUnix: number) => {
  const nowMoment = moment.unix(nowUnix);
  const count = +nowMoment.format('MM');
  const firstDayOfYear = nowMoment.startOf('year');
  const Title = new Array(count).fill('').map((i, index) => ({
    title:
      index !== count - 1 && index !== count - 2
        ? `${index + 1}月`
        : index === count - 2
        ? '上月'
        : '本月',
    date:
      index !== 0
        ? firstDayOfYear.add(1, 'month').unix()
        : firstDayOfYear.unix(),
  }));
  return Title;
};

export const getYearTitle = (nowUnix: number) => {
  const nowMoment = moment.unix(nowUnix);
  const count = 3; // 值展示近三年的
  const YearStr = nowMoment.format('YYYY');
  const firstDayOfYear = moment.unix(nowUnix).startOf('year');
  const Title = new Array(count).fill('').map((i, index) => ({
    title:
      index !== count - 1 && index !== count - 2
        ? `${+YearStr + index + 1 - count}`
        : index === count - 2
        ? '去年'
        : '今年',
    date:
      index !== 2
        ? moment
            .unix(nowUnix)
            .startOf('year')
            .add(-count + index + 1, 'year')
            .unix()
        : firstDayOfYear.unix(),
  }));
  return Title;
};

export default [
  () => [{ title: '', date: 0 }],
  getWeekTitle,
  getMonthTitle,
  getYearTitle,
];
