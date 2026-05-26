import type { TableColumnType } from 'antd'
import styles from './columnsConfig.module.css'
import type { ColumnGroupType } from 'antd/es/table'
import type { ScheduleRecord } from '@/types'
import i18n from '@/i18n'

const renderText = (text: string) => <div className={styles.text}>{text}</div>

const getWeekTypeColumns = (dayKey: string) => [
  {
    title: i18n.t('weeks.weekType0.shortName'),
    dataIndex: [dayKey, 'weekType0'],
    key: `${dayKey}weekType0`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: i18n.t('weeks.weekType1.shortName'),
    dataIndex: [dayKey, 'weekType1'],
    key: `${dayKey}weekType1`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: i18n.t('weeks.weekType2.shortName'),
    dataIndex: [dayKey, 'weekType2'],
    key: `${dayKey}weekType2`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: i18n.t('weeks.weekType3.shortName'),
    dataIndex: [dayKey, 'weekType3'],
    key: `${dayKey}weekType3`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
]

const getDaysColumns = (weekKey: string) => [
  {
    title: i18n.t('days.day1.shortName'),
    dataIndex: ['day1', weekKey],
    key: `day1${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: i18n.t('days.day2.shortName'),
    dataIndex: ['day2', weekKey],
    key: `day2${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: i18n.t('days.day3.shortName'),
    dataIndex: ['day3', weekKey],
    key: `day3${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: i18n.t('days.day4.shortName'),
    dataIndex: ['day4', weekKey],
    key: `day4${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: i18n.t('days.day5.shortName'),
    dataIndex: ['day5', weekKey],
    key: `day5${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: i18n.t('days.day6.shortName'),
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
    title: i18n.t('days.day1.longName'),
    align: 'center' as const,
    children: getWeekTypeColumns('day1'),
  },
  {
    title: i18n.t('days.day2.longName'),
    align: 'center' as const,
    children: getWeekTypeColumns('day2'),
  },
  {
    title: i18n.t('days.day3.longName'),
    align: 'center' as const,
    children: getWeekTypeColumns('day3'),
  },
  {
    title: i18n.t('days.day4.longName'),
    align: 'center' as const,
    children: getWeekTypeColumns('day4'),
  },
  {
    title: i18n.t('days.day5.longName'),
    align: 'center' as const,
    children: getWeekTypeColumns('day5'),
  },
  {
    title: i18n.t('days.day6.longName'),
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
    title: i18n.t('weeks.weekType0.longName'),
    align: 'center' as const,
    children: getDaysColumns('weekType0'),
  },
  {
    title: i18n.t('weeks.weekType1.longName'),
    align: 'center' as const,
    children: getDaysColumns('weekType1'),
  },
  {
    title: i18n.t('weeks.weekType2.longName'),
    align: 'center' as const,
    children: getDaysColumns('weekType2'),
  },
  {
    title: i18n.t('weeks.weekType3.longName'),
    align: 'center' as const,
    children: getDaysColumns('weekType3'),
  },
]
