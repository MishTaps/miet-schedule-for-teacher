import type { TableColumnType } from 'antd'
import styles from './columnsConfig.module.css'
import type { ColumnGroupType } from 'antd/es/table'
import type { ScheduleRecord } from '@/types'

const renderText = (text: string) => <div className={styles.text}>{text}</div>

const getWeekTypeColumns = (dayKey: string) => [
  {
    title: 'Числ-I',
    dataIndex: [dayKey, 'weekType0'],
    key: `${dayKey}weekType0`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: 'Знам-I',
    dataIndex: [dayKey, 'weekType1'],
    key: `${dayKey}weekType1`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: 'Числ-II',
    dataIndex: [dayKey, 'weekType2'],
    key: `${dayKey}weekType2`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: 'Знам-II',
    dataIndex: [dayKey, 'weekType3'],
    key: `${dayKey}weekType3`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
]

const getDaysColumns = (weekKey: string) => [
  {
    title: 'Пн',
    dataIndex: ['day1', weekKey],
    key: `day1${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: 'Вт',
    dataIndex: ['day2', weekKey],
    key: `day2${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: 'Ср',
    dataIndex: ['day3', weekKey],
    key: `day3${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: 'Чт',
    dataIndex: ['day4', weekKey],
    key: `day4${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: 'Пт',
    dataIndex: ['day5', weekKey],
    key: `day5${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: 'Сб',
    dataIndex: ['day6', weekKey],
    key: `day6${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
]

export const columnsConfigDays: (
  | TableColumnType<ScheduleRecord>
  | ColumnGroupType<ScheduleRecord>
)[] = [
  {
    title: 'Время занятия',
    dataIndex: 'lesson',
    key: 'lesson',
    width: 120,
    render: (text: string) => renderText(text),
    fixed: 'left',
  },
  {
    title: 'Понедельник',
    align: 'center' as const,
    children: getWeekTypeColumns('day1'),
  },
  {
    title: 'Вторник',
    align: 'center' as const,
    children: getWeekTypeColumns('day2'),
  },
  {
    title: 'Среда',
    align: 'center' as const,
    children: getWeekTypeColumns('day3'),
  },
  {
    title: 'Четверг',
    align: 'center' as const,
    children: getWeekTypeColumns('day4'),
  },
  {
    title: 'Пятница',
    align: 'center' as const,
    children: getWeekTypeColumns('day5'),
  },
  {
    title: 'Суббота',
    align: 'center' as const,
    children: getWeekTypeColumns('day6'),
  },
]

export const columnsConfigWeeks: (
  | TableColumnType<ScheduleRecord>
  | ColumnGroupType<ScheduleRecord>
)[] = [
  {
    title: 'Время занятия',
    dataIndex: 'lesson',
    key: 'lesson',
    width: 120,
    render: (text: string) => renderText(text),
    fixed: 'left',
  },
  {
    title: 'Числитель-I',
    align: 'center' as const,
    children: getDaysColumns('weekType0'),
  },
  {
    title: 'Знаменатель-I',
    align: 'center' as const,
    children: getDaysColumns('weekType1'),
  },
  {
    title: 'Числитель-II',
    align: 'center' as const,
    children: getDaysColumns('weekType2'),
  },
  {
    title: 'Знаменатель-II',
    align: 'center' as const,
    children: getDaysColumns('weekType3'),
  },
]
