import i18n from '@/i18n'

const createEmptyDayData = () => ({
  weekType0: '',
  weekType1: '',
  weekType2: '',
  weekType3: '',
})

const createRow = (key: string, lessonKey: string) => ({
  key,
  lesson: i18n.t(lessonKey),
  day1: createEmptyDayData(),
  day2: createEmptyDayData(),
  day3: createEmptyDayData(),
  day4: createEmptyDayData(),
  day5: createEmptyDayData(),
  day6: createEmptyDayData(),
})

export const getDefaultTableData = () => [
  createRow('1', 'time.class1'),
  createRow('2', 'time.class2'),
  createRow('3', 'time.class3'),
  createRow('4', 'time.class4'),
  createRow('5', 'time.class5'),
  createRow('6', 'time.class6'),
  createRow('7', 'time.class7'),
  createRow('8', 'time.class8'),
]
