import type { TableColumnType } from 'antd'
import '../MainWorkplace.css'
import type { ColumnGroupType } from 'antd/es/table'
import type { ScheduleRecord } from '@/types'

const getWeekTypeColumns = (dayKey: string) => [
  {
    title: 'Ч-I',
    dataIndex: [dayKey, 'weekType0'],
    key: `${dayKey}weekType0`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
  {
    title: 'З-I',
    dataIndex: [dayKey, 'weekType1'],
    key: `${dayKey}weekType1`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
  {
    title: 'Ч-II',
    dataIndex: [dayKey, 'weekType2'],
    key: `${dayKey}weekType2`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
  {
    title: 'З-II',
    dataIndex: [dayKey, 'weekType3'],
    key: `${dayKey}weekType3`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
]

const getDaysColumns = (weekKey: string) => [
  {
    title: 'Пн',
    dataIndex: ['day1', weekKey],
    key: `day1${weekKey}`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
  {
    title: 'Вт',
    dataIndex: ['day2', weekKey],
    key: `day2${weekKey}`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
  {
    title: 'Ср',
    dataIndex: ['day3', weekKey],
    key: `day3${weekKey}`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
  {
    title: 'Чт',
    dataIndex: ['day4', weekKey],
    key: `day4${weekKey}`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
  {
    title: 'Пт',
    dataIndex: ['day5', weekKey],
    key: `day5${weekKey}`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
  {
    title: 'Сб',
    dataIndex: ['day6', weekKey],
    key: `day6${weekKey}`,
    align: 'center' as const,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    className: 'weekColumn',
  },
]

export const columnsConfigDays: (
  | TableColumnType<ScheduleRecord>
  | ColumnGroupType<ScheduleRecord>
)[] = [
  {
    title: 'Пары',
    dataIndex: 'lesson',
    key: 'lesson',
    width: 120,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    fixed: 'left',
  },
  {
    title: 'Понедельник',
    align: 'center' as const,
    children: getWeekTypeColumns('day1'),
    className: 'dayColumn',
  },
  {
    title: 'Вторник',
    align: 'center' as const,
    children: getWeekTypeColumns('day2'),
    className: 'dayColumn',
  },
  {
    title: 'Среда',
    align: 'center' as const,
    children: getWeekTypeColumns('day3'),
    className: 'dayColumn',
  },
  {
    title: 'Четверг',
    align: 'center' as const,
    children: getWeekTypeColumns('day4'),
    className: 'dayColumn',
  },
  {
    title: 'Пятница',
    align: 'center' as const,
    children: getWeekTypeColumns('day5'),
    className: 'dayColumn',
  },
  {
    title: 'Суббота',
    align: 'center' as const,
    children: getWeekTypeColumns('day6'),
    className: 'dayColumn',
  },
]

export const columnsConfigWeeks: (
  | TableColumnType<ScheduleRecord>
  | ColumnGroupType<ScheduleRecord>
)[] = [
  {
    title: 'Пары',
    dataIndex: 'lesson',
    key: 'lesson',
    width: 120,
    render: (text: string) => <div style={{ whiteSpace: 'pre-line' }}>{text}</div>,
    fixed: 'left',
  },
  {
    title: 'Числитель-I',
    align: 'center' as const,
    children: getDaysColumns('weekType0'),
    className: 'dayColumn',
  },
  {
    title: 'Знаменатель-I',
    align: 'center' as const,
    children: getDaysColumns('weekType1'),
    className: 'dayColumn',
  },
  {
    title: 'Числитель-II',
    align: 'center' as const,
    children: getDaysColumns('weekType2'),
    className: 'dayColumn',
  },
  {
    title: 'Знаменатель-II',
    align: 'center' as const,
    children: getDaysColumns('weekType3'),
    className: 'dayColumn',
  },
]
