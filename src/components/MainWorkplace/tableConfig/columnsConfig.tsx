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
