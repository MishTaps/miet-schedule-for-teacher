import { Divider, Table } from 'antd'
import { columnsConfig, type ScheduleRecord, type WeekTypes } from '../MainWorkplace/columnsConfig'
import { useMemo } from 'react'

interface ScheduleTable {
  hideEmptyRows: boolean
  rawTableData: ScheduleRecord[]
  selectedWeekType: string
}

export const ScheduleTable: React.FC<ScheduleTable> = ({
  hideEmptyRows,
  rawTableData,
  selectedWeekType,
}) => {
  const visibleColumns = useMemo(() => {
    if (selectedWeekType === 'allWeekTypes') return columnsConfig

    return columnsConfig.map((column) => {
      if (!('children' in column)) return column

      const filteredChildren = column.children?.filter((child) => {
        return child.key?.toString().endsWith(selectedWeekType)
      })

      return {
        ...column,
        children: filteredChildren,
      }
    })
  }, [selectedWeekType])

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
