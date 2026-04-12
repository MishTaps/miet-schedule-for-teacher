import { Button, Divider, Empty, message, Table } from 'antd'
import { useMemo } from 'react'
import type { ColumnType } from 'antd/es/table'
import { columnsConfigDays, columnsConfigWeeks } from '../MainWorkplace/tableConfig/columnsConfig'
import type { ScheduleRecord, WeekTypes } from '@/types'
import { useFiltrationSettingsStore, useTeachersStore, useVisualSettingsStore } from '@/stores'

interface ScheduleTable {
  tableData: ScheduleRecord[]
}

export const ScheduleTable: React.FC<ScheduleTable> = ({ tableData }) => {
  const teachers = useTeachersStore((state) => state.teachers)
  const selectedTeacher = useTeachersStore((state) => state.selectedTeacher)
  const setSelectedTeacher = useTeachersStore((state) => state.setSelectedTeacher)

  const hideEmptyDaysTypes = useVisualSettingsStore((state) => state.hideEmptyDaysTypes)
  const hideEmptyRows = useVisualSettingsStore((state) => state.hideEmptyRows)
  const hideTimeColumn = useVisualSettingsStore((state) => state.hideTimeColumn)
  const sortColumnType = useVisualSettingsStore((state) => state.sortColumnType)

  const selectedDayOfWeek = useFiltrationSettingsStore((state) => state.selectedDayOfWeek)
  const selectedWeekType = useFiltrationSettingsStore((state) => state.selectedWeekType)
  const setSelectedDayOfWeek = useFiltrationSettingsStore((state) => state.setSelectedDayOfWeek)
  const setSelectedWeekType = useFiltrationSettingsStore((state) => state.setSelectedWeekType)

  const isTeacherAvailable = selectedTeacher && teachers.includes(selectedTeacher)

  const columnsConfig = sortColumnType == 'day' ? columnsConfigDays : columnsConfigWeeks

  const visibleColumns = useMemo(() => {
    const isWeekTypeColumnEmpty = (dayKey: string, weekType: string) => {
      return tableData.every((row) => {
        const day = row[dayKey] as WeekTypes | undefined
        const value = day?.[weekType]
        return typeof value !== 'string' || value.trim() === ''
      })
    }

    return columnsConfig
      .map((column) => {
        if (hideTimeColumn && column.key == 'lesson') return null
        if (!('children' in column)) return column

        const childDataIndex = (column.children?.[0] as ColumnType<ScheduleRecord> | undefined)
          ?.dataIndex
        const dayKey = Array.isArray(childDataIndex) ? (childDataIndex[0] as string) : ''
        if (!dayKey) return null

        const children = column.children
          .filter((child) => {
            if (selectedDayOfWeek === 'allDays') return true
            if (!('dataIndex' in child)) return false
            return (child.dataIndex as string[])[0] === selectedDayOfWeek
          })
          .filter((child) => {
            if (selectedWeekType === 'allWeekTypes') return true
            if (!('dataIndex' in child)) return false
            return (child.dataIndex as string[])[1] === selectedWeekType
          })
          .filter((child) => {
            if (!hideEmptyDaysTypes) return true
            if (!('dataIndex' in child)) return false
            const [childDayKey, weekType] = child.dataIndex as string[]
            return !isWeekTypeColumnEmpty(childDayKey, weekType)
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
  }, [
    columnsConfig,
    tableData,
    hideTimeColumn,
    selectedWeekType,
    selectedDayOfWeek,
    hideEmptyDaysTypes,
  ])

  const visibleTableData = useMemo(() => {
    const isRowEmpty = (row: ScheduleRecord) => {
      const dayKeys = Object.keys(row).filter((key) => key.startsWith('day'))

      if (selectedDayOfWeek && selectedDayOfWeek !== 'allDays') {
        const day = row[selectedDayOfWeek]
        if (!day) return true
        if (selectedWeekType === 'allWeekTypes') {
          return Object.values(day).every((v) => typeof v !== 'string' || v.trim() === '')
        }
        const value = day[selectedWeekType]
        return typeof value !== 'string' || value.trim() === ''
      }

      return dayKeys.every((dayKey) => {
        const day = row[dayKey] as WeekTypes
        if (!day) return true
        if (selectedWeekType === 'allWeekTypes') {
          return Object.values(day).every((v) => typeof v !== 'string' || v.trim() === '')
        }
        const value = day[selectedWeekType as keyof WeekTypes]
        return typeof value !== 'string' || value.trim() === ''
      })
    }

    if (!hideEmptyRows) return tableData
    return tableData.filter((row) => !isRowEmpty(row))
  }, [hideEmptyRows, tableData, selectedWeekType, selectedDayOfWeek])

  const resetFilters = () => {
    setSelectedDayOfWeek('allDays')
    setSelectedWeekType('allWeekTypes')
    message.info('Фильтры сброшены')
  }

  const resetTeacher = () => {
    setSelectedTeacher(null)
    message.info('Выберите нового преподавателя')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isTeacherAvailable) {
    return (
      <>
        <Divider>Расписание преподавателя</Divider>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="У данного преподавателя отсутствуют занятия..."
        >
          <Button type="default" onClick={resetTeacher}>
            Сбросить преподавателя
          </Button>
        </Empty>
      </>
    )
  }

  return (
    <>
      <Divider>Расписание преподавателя</Divider>
      <Table
        dataSource={visibleTableData}
        columns={visibleColumns}
        pagination={false}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Занятия у преподавателя по выбранным фильтрам не найдены..."
            >
              <Button type="default" onClick={resetFilters}>
                Сбросить фильтры
              </Button>
            </Empty>
          ),
        }}
        sticky
        bordered
      />
    </>
  )
}
