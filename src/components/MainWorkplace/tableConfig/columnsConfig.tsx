import type { TableColumnType } from 'antd'
import styles from './columnsConfig.module.css'
import type { ColumnGroupType } from 'antd/es/table'
import type { ScheduleRecord } from '@/types'
import type { TFunction } from 'i18next'

const renderText = (text: string) => <div className={styles.text}>{text}</div>

const getWeekTypeColumns = (dayKey: string, t: TFunction) => [
  {
    title: t('weeks.weekType0.shortName'),
    dataIndex: [dayKey, 'weekType0'],
    key: `${dayKey}weekType0`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: t('weeks.weekType1.shortName'),
    dataIndex: [dayKey, 'weekType1'],
    key: `${dayKey}weekType1`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: t('weeks.weekType2.shortName'),
    dataIndex: [dayKey, 'weekType2'],
    key: `${dayKey}weekType2`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: t('weeks.weekType3.shortName'),
    dataIndex: [dayKey, 'weekType3'],
    key: `${dayKey}weekType3`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
]

const getDaysColumns = (weekKey: string, t: TFunction) => [
  {
    title: t('days.day1.shortName'),
    dataIndex: ['day1', weekKey],
    key: `day1${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: t('days.day2.shortName'),
    dataIndex: ['day2', weekKey],
    key: `day2${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: t('days.day3.shortName'),
    dataIndex: ['day3', weekKey],
    key: `day3${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: t('days.day4.shortName'),
    dataIndex: ['day4', weekKey],
    key: `day4${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: t('days.day5.shortName'),
    dataIndex: ['day5', weekKey],
    key: `day5${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
  {
    title: t('days.day6.shortName'),
    dataIndex: ['day6', weekKey],
    key: `day6${weekKey}`,
    align: 'center' as const,
    render: (text: string) => renderText(text),
    className: styles.column,
  },
]

export const getColumnsConfigDays = (t: TFunction): (
  | TableColumnType<ScheduleRecord>
  | ColumnGroupType<ScheduleRecord>
)[] => [
    {
      title: t('time.header'),
      dataIndex: 'lesson',
      key: 'lesson',
      width: 120,
      render: (text: string) => renderText(text),
      fixed: 'left',
    },
    {
      title: t('days.day1.longName'),
      align: 'center' as const,
      children: getWeekTypeColumns('day1', t),
    },
    {
      title: t('days.day2.longName'),
      align: 'center' as const,
      children: getWeekTypeColumns('day2', t),
    },
    {
      title: t('days.day3.longName'),
      align: 'center' as const,
      children: getWeekTypeColumns('day3', t),
    },
    {
      title: t('days.day4.longName'),
      align: 'center' as const,
      children: getWeekTypeColumns('day4', t),
    },
    {
      title: t('days.day5.longName'),
      align: 'center' as const,
      children: getWeekTypeColumns('day5', t),
    },
    {
      title: t('days.day6.longName'),
      align: 'center' as const,
      children: getWeekTypeColumns('day6', t),
    },
  ]

export const getColumnsConfigWeeks = (t: TFunction): (
  | TableColumnType<ScheduleRecord>
  | ColumnGroupType<ScheduleRecord>
)[] => [
    {
      title: 'Время занятия',
      dataIndex: 'lesson',
      key: 'lesson',
      width: 120,
      render: (text: string) => renderText(text),
      fixed: 'left',
    },
    {
      title: t('weeks.weekType0.longName'),
      align: 'center' as const,
      children: getDaysColumns('weekType0', t),
    },
    {
      title: t('weeks.weekType1.longName'),
      align: 'center' as const,
      children: getDaysColumns('weekType1', t),
    },
    {
      title: t('weeks.weekType2.longName'),
      align: 'center' as const,
      children: getDaysColumns('weekType2', t),
    },
    {
      title: t('weeks.weekType3.longName'),
      align: 'center' as const,
      children: getDaysColumns('weekType3', t),
    },
  ]
