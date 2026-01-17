import {
  Button,
  Divider,
  Form,
  Input,
  Progress,
  Select,
  Spin,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import './MainWorkplace.css'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'

import { columnsConfig, type ScheduleRecord, type WeekTypes } from './columnsConfig'
import { dataSource } from './dataSource'
import { GroupsService } from '../../data/sources/GroupsService/GroupsService'
import { MoreSettings } from '../MoreSettings/MoreSettings'

export const MainWorkplace = () => {
  const [groups, setGroups] = useState<string[]>([])
  const [groupsScanned, setGroupsScanned] = useState(0)

  const [hideEmptyDaysTypes, setHideEmptyDaysTypes] = useState(false)
  const [hideEmptyRows, setHideEmptyRows] = useState(false)

  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingAllGroupsSchedule, setLoadingAllGroupsSchedule] = useState(false)

  const [rawTableData, setRawTableData] = useState<ScheduleRecord[]>(dataSource)

  const [teacherForm] = Form.useForm()

  const { getGroups, getScheduleForGroup } = GroupsService

  useEffect(() => {
    const fetchGroups = async () => {
      const groupsData = await getGroups()
      setGroups(groupsData || [])
      setLoadingGroups(false)
    }

    fetchGroups()
  }, [getGroups])

  const isRowEmpty = (row: ScheduleRecord) => {
    return Object.keys(row)
      .filter((key) => key.startsWith('day'))
      .every((dayKey) => {
        const day = row[dayKey] as WeekTypes | undefined
        if (!day) return true

        return Object.values(day).every((v) => typeof v !== 'string' || v.trim() === '')
      })
  }

  const getSchedule = async (teacher: string) => {
    const updatedData: ScheduleRecord[] = structuredClone(dataSource)

    for (const group of groups) {
      try {
        const scheduleData = await getScheduleForGroup(group)
        setGroupsScanned((prev) => prev + 1)
        if (!scheduleData?.Data) continue
        const lessons = scheduleData.Data.filter((l) => l.Class && l.Class.TeacherFull === teacher)
        if (lessons.length === 0) continue
        lessons.forEach((lesson) => {
          const timeIndex = lesson.Time.Code - 1
          const dayKey = `day${lesson.Day + 1}`
          const weekKey = `weekType${lesson.DayNumber}` as keyof WeekTypes

          if (!updatedData[timeIndex]) return

          const currentRow = updatedData[timeIndex]
          const currentDay = (currentRow[dayKey] as WeekTypes) ?? {
            weekType0: '',
            weekType1: '',
            weekType2: '',
            weekType3: '',
          }

          updatedData[timeIndex] = {
            ...currentRow,
            [dayKey]: {
              ...currentDay,
              [weekKey]: `${lesson.Class.Name}\n${lesson.Room.Name}`,
            },
          }
        })
      } catch (e) {
        console.error(e)
      }
    }

    setRawTableData(updatedData)
    setLoadingAllGroupsSchedule(false)
  }

  const visibleTableData = useMemo(() => {
    if (!hideEmptyRows) return rawTableData
    return rawTableData.filter((row) => !isRowEmpty(row))
  }, [rawTableData, hideEmptyRows])

  const groupScannedPercent = Math.round((groupsScanned / (groups.length || 1)) * 100)

  return (
    <main>
      <Spin spinning={loadingGroups} tip="Получение списка групп...">
        <Typography.Title level={5} style={{ padding: '0 30px', textAlign: 'center' }}>
          Всего найдено групп: {groups.length}
        </Typography.Title>

        <Divider>Заполните форму:</Divider>
        <Form
          layout="vertical"
          form={teacherForm}
          onFinish={(values) => {
            getSchedule(values.teacherName)
            setLoadingAllGroupsSchedule(true)
          }}
          disabled={loadingGroups || loadingAllGroupsSchedule}
          style={{ padding: '0 30px' }}
        >
          <Form.Item
            label="Введите полные ФИО преподавателя:"
            name="teacherName"
            rules={[
              {
                required: true,
                message: 'Введите полные ФИО преподавателя в формате "Иванов Иван Иванович"',
              },
            ]}
          >
            <Input
              placeholder="Иванов Иван Иванович"
              prefix={<UserOutlined />}
              style={{ width: '50%' }}
            />
          </Form.Item>

          <Form.Item label="Выберите тип недели:" name="weekType" initialValue="allWeekTypes">
            <Tooltip title="Функция будет доступна в следующих версиях">
              <Select
                disabled
                style={{ width: '50%' }}
                options={[
                  { value: 'weekType0', label: 'Числитель I' },
                  { value: 'weekType1', label: 'Знаменатель I' },
                  { value: 'weekType2', label: 'Числитель II' },
                  { value: 'weekType3', label: 'Знаменатель II' },
                  { value: 'allWeekTypes', label: 'Полное расписание' },
                ]}
                defaultValue="allWeekTypes"
              />
            </Tooltip>
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
              Показать расписание
            </Button>
          </Form.Item>
        </Form>

        {(loadingAllGroupsSchedule || groupScannedPercent == 100) && (
          <MoreSettings
            hideEmptyDaysTypes={hideEmptyDaysTypes}
            setHideEmptyDaysTypes={setHideEmptyDaysTypes}
            hideEmptyRows={hideEmptyRows}
            setHideEmptyRows={setHideEmptyRows}
          />
        )}

        {loadingAllGroupsSchedule && groupScannedPercent < 100 && (
          <>
            <Divider>Загрузка расписания...</Divider>
            <div style={{ textAlign: 'center' }}>Это займёт ~1–2 минуты</div>
            <Progress
              percent={groupScannedPercent}
              status="active"
              percentPosition={{ align: 'center' }}
              style={{ padding: '0 0 20px 0' }}
            />
          </>
        )}

        {groupScannedPercent === 100 && (
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
        )}
      </Spin>
    </main>
  )
}
