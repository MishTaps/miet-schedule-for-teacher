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

import { useEffect, useState } from 'react'
import { columnsConfig, type ScheduleRecord, type WeekTypes } from './columnsConfig.tsx'
import { dataSource } from './dataSource.tsx'
import { GroupsService } from '../../data/sources/GroupsService/GroupsService.ts'
import { MoreSettings } from '../MoreSettings/MoreSettings.tsx'

export const MainWorkplace = () => {
  const [groups, setGroups] = useState<string[]>([])
  const [groupsScanned, setGroupsScanned] = useState<number>(0)

  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingAllGroupsSchedule, setLoadingAllGroupsSchedule] = useState(false)

  const [tableData, setTableData] = useState<ScheduleRecord[]>(dataSource)

  const [teacherForm] = Form.useForm()

  const { getGroups, getScheduleForGroup } = GroupsService

  useEffect(() => {
    const fetchAllData = async () => {
      const groupsData = await getGroups()
      setGroups(groupsData || [])

      setLoadingGroups(false)
    }

    fetchAllData()
  }, [getGroups])

  const getSchedule = async (teacher: string) => {
    const updatedData = [...tableData]

    for (const group of groups || []) {
      try {
        const scheduleData = await getScheduleForGroup(group)
        setGroupsScanned((prev) => prev + 1)
        if (!scheduleData?.Data) continue
        const lessons = scheduleData.Data.filter((l) => l.Class && l.Class.TeacherFull === teacher)
        if (lessons.length === 0) continue

        lessons.forEach((lesson) => {
          const timeIndex: number = lesson.Time.Code - 1
          const dayKey: string = `day${lesson.Day + 1}`
          const weekKey = `weekType${lesson.DayNumber}` as keyof WeekTypes

          if (updatedData[timeIndex]) {
            const currentRow = updatedData[timeIndex]
            const currentDay = (currentRow[dayKey] as WeekTypes) || {
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
          }
        })
        setTableData([...updatedData])
      } catch (e) {
        console.error(e)
      }
    }
    setLoadingAllGroupsSchedule(false)
  }

  const groupScannedPercent = Math.round((groupsScanned / (groups?.length || 1)) * 100)

  return (
    <>
      <main>
        <Spin spinning={loadingGroups} tip="Получение списка групп...">
          <Typography.Title level={5} style={{ padding: '0 30px', textAlign: 'center' }}>
            Всего найдено групп: {groups?.length}
          </Typography.Title>
          <Divider>Заполните форму</Divider>
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
              required
            >
              <Input
                placeholder="Иванов Иван Иванович"
                prefix={<UserOutlined />}
                style={{ width: '50%' }}
              />
            </Form.Item>
            <Form.Item label="Выберите тип недели:" name="weekType" initialValue="allWeekTypes">
              <Tooltip placement="top" title="Функция будет доступна в следующих версиях">
                <Select
                  options={[
                    { value: 'weekType0', label: 'Числитель I' },
                    { value: 'weekType1', label: 'Числитель II' },
                    { value: 'weekType2', label: 'Знаменатель I' },
                    { value: 'weekType3', label: 'Знаменатель II' },
                    { value: 'allWeekTypes', label: 'Полное расписание' },
                  ]}
                  style={{ width: '50%' }}
                  disabled
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
          <MoreSettings />
          {loadingAllGroupsSchedule && groupScannedPercent < 100 ? (
            <div>
              <div style={{ textAlign: 'center' }}>
                Загрузка расписания. Это займёт ~1-2 минуты...
              </div>
              <Progress
                percent={groupScannedPercent}
                status={groupScannedPercent == 100 ? 'success' : 'active'}
                percentPosition={{ align: 'center', type: 'outer' }}
              />
            </div>
          ) : null}

          {groupScannedPercent === 100 ? (
            <div>
              <Divider>Расписание преподавателя готово!</Divider>
              <Table
                dataSource={tableData}
                columns={columnsConfig}
                pagination={false}
                scroll={{ x: 'max-content' }}
                sticky
              />
            </div>
          ) : null}
        </Spin>
      </main>
    </>
  )
}
