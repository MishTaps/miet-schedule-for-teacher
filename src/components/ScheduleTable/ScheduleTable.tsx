import { Divider, Table } from 'antd'
import { columnsConfig, type ScheduleRecord, type WeekTypes } from '../MainWorkplace/columnsConfig'
import { useMemo } from 'react'

interface ScheduleTable {
  hideEmptyRows: boolean
  rawTableData: ScheduleRecord[]
}

export const ScheduleTable: React.FC<ScheduleTable> = ({ hideEmptyRows, rawTableData }) => {
  const isRowEmpty = (row: ScheduleRecord) => {
    return Object.keys(row)
      .filter((key) => key.startsWith('day'))
      .every((dayKey) => {
        const day = row[dayKey] as WeekTypes | undefined
        if (!day) return true

        return Object.values(day).every((v) => typeof v !== 'string' || v.trim() === '')
      })
  }

  const visibleTableData = useMemo(() => {
    if (!hideEmptyRows) return rawTableData
    return rawTableData.filter((row) => !isRowEmpty(row))
  }, [rawTableData, hideEmptyRows])

  return (
    <>
      <Divider>Расписание преподавателя готово!</Divider>
      <Table
        dataSource={visibleTableData}
        columns={columnsConfig}
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
