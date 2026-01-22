import { Divider, Table } from 'antd'
import { useMemo } from 'react'
import type { ColumnType } from 'antd/es/table'
import type { ScheduleRecord, WeekTypes } from '../../types'
import { columnsConfig } from '../MainWorkplace/columnsConfig'

interface ScheduleTable {
  hideEmptyRows: boolean
  rawTableData: ScheduleRecord[]
  selectedWeekType: string
  hideEmptyDaysTypes: boolean
}

export const ScheduleTable: React.FC<ScheduleTable> = ({
  hideEmptyRows,
  rawTableData,
  selectedWeekType,
  hideEmptyDaysTypes,
}) => {
  const visibleColumns = useMemo(() => {
    const isWeekTypeColumnEmpty = (dayKey: string, weekType: string) => {
      return rawTableData.every((row) => {
        const day = row[dayKey] as WeekTypes | undefined
        const value = day?.[weekType]
        return typeof value !== 'string' || value.trim() === ''
      })
    }

    return columnsConfig
      .map((column) => {
        if (!('children' in column)) return column

        const childDataIndex = (column.children?.[0] as ColumnType<ScheduleRecord> | undefined)
          ?.dataIndex
        const dayKey = Array.isArray(childDataIndex) ? (childDataIndex[0] as string) : ''
        if (!dayKey) return null

        const children = column.children
          .filter((child) => {
            if (selectedWeekType === 'allWeekTypes') return true
            if (!('dataIndex' in child)) return false
            return (child.dataIndex as string[])[1] === selectedWeekType
          })
          .filter((child) => {
            if (!hideEmptyDaysTypes) return true
            if (!('dataIndex' in child)) return false
            const [, weekType] = child.dataIndex as string[]
            return !isWeekTypeColumnEmpty(dayKey, weekType)
          })

        if (children.length === 0) {
          return null
        }

        return {
          ...column,
          children,
        }
      })
      .filter(
        (
          column,
        ): column is
          | ColumnType<ScheduleRecord>
          | Exclude<(typeof columnsConfig)[0], { children?: unknown }> => column !== null,
      )
  }, [rawTableData, selectedWeekType, hideEmptyDaysTypes])

  const visibleTableData = useMemo(() => {
    const isRowEmpty = (row: ScheduleRecord) => {
      return Object.keys(row)
        .filter((key) => key.startsWith('day'))
        .every((dayKey) => {
          const day = row[dayKey] as WeekTypes | undefined
          if (!day) return true
          if (selectedWeekType === 'allWeekTypes') {
            return Object.values(day).every((v) => typeof v !== 'string' || v.trim() === '')
          }
          const value = day[selectedWeekType]
          return typeof value !== 'string' || value.trim() === ''
        })
    }

    if (!hideEmptyRows) return rawTableData
    return rawTableData.filter((row) => !isRowEmpty(row))
  }, [hideEmptyRows, rawTableData, selectedWeekType])

  return (
    <>
      <Divider>Расписание преподавателя готово!</Divider>
      <Table
        dataSource={visibleTableData}
        columns={visibleColumns}
        pagination={false}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: 'Занятия не найдены',
        }}
        sticky
      />
    </>
  )
}
