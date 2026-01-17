import type { TableColumnType } from 'antd'
import './MainWorkplace.css'
import type { ColumnGroupType } from 'antd/es/table'

export type WeekTypes = {
  weekType0: string
  weekType1: string
  weekType2: string
  weekType3: string
  [key: string]: string
}

export type ScheduleRecord = {
  key: string
  lesson: string
  day1: WeekTypes
  day2: WeekTypes
  day3: WeekTypes
  day4: WeekTypes
  day5: WeekTypes
  day6: WeekTypes
  [key: string]: string | WeekTypes
}

const getWeekTypeColumns = (dayKey: string) => [
  {
    title: 'Ч-I',
    dataIndex: [dayKey, 'weekType0'],
    key: `${dayKey}weekType0`,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'column',
  },
  {
    title: 'З-I',
    dataIndex: [dayKey, 'weekType1'],
    key: `${dayKey}weekType1`,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'column',
  },
  {
    title: 'Ч-II',
    dataIndex: [dayKey, 'weekType2'],
    key: `${dayKey}weekType2`,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'column',
  },
  {
    title: 'З-II',
    dataIndex: [dayKey, 'weekType3'],
    key: `${dayKey}weekType3`,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'column',
  },
]

export const columnsConfig: (TableColumnType<ScheduleRecord> | ColumnGroupType<ScheduleRecord>)[] =
  [
    {
      title: 'Пара',
      dataIndex: 'lesson',
      key: 'lesson',
      width: 120,
      render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
      fixed: 'left',
    },
    {
      title: 'Понедельник',
      children: getWeekTypeColumns('day1'),
    },
    {
      title: 'Вторник',
      children: getWeekTypeColumns('day2'),
    },
    {
      title: 'Среда',
      children: getWeekTypeColumns('day3'),
    },
    {
      title: 'Четверг',
      children: getWeekTypeColumns('day4'),
    },
    {
      title: 'Пятница',
      children: getWeekTypeColumns('day5'),
    },
    {
      title: 'Суббота',
      children: getWeekTypeColumns('day6'),
    },
  ]
