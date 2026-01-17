import { Button, Divider, Form, Input, message, Select, Tooltip } from 'antd'
import { SearchOutlined, UserOutlined } from '@ant-design/icons'
import type { ScheduleRecord, WeekTypes } from '../MainWorkplace/columnsConfig'
import { GroupsService } from '../../data/sources'

interface MainForm {
  setGroupsScanned: (value: number | ((prev: number) => number)) => void
  setLoadingAllGroupsSchedule: (value: boolean) => void
  setRawTableData: (value: ScheduleRecord[]) => void
  groups: string[]
  dataSource: ScheduleRecord[]
  loadingGroups: boolean
  loadingAllGroupsSchedule: boolean
}

export const MainForm: React.FC<MainForm> = ({
  setGroupsScanned,
  setLoadingAllGroupsSchedule,
  setRawTableData,
  groups,
  dataSource,
  loadingGroups,
  loadingAllGroupsSchedule,
}) => {
  const [form] = Form.useForm()

  const { getScheduleForGroup } = GroupsService

  const getSchedule = async (teacher: string) => {
    setGroupsScanned(0)
    const updatedData: ScheduleRecord[] = structuredClone(dataSource)
    const BATCH_SIZE = 10

    for (let i = 0; i < groups.length; i += BATCH_SIZE) {
      const batch = groups.slice(i, i + BATCH_SIZE)
      await Promise.all(
        batch.map(async (group) => {
          try {
            const scheduleData = await getScheduleForGroup(group)
            setGroupsScanned((prev: number) => prev + 1)

            if (!scheduleData?.Data) return

            const lessons = scheduleData.Data.filter(
              (l) => l.Class && l.Class.TeacherFull === teacher,
            )

            if (lessons.length === 0) return

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
            message.error(`Ошибка при загрузке расписания группы ${group}`)
            console.error(`Ошибка при загрузке группы ${group}:`, e)
          }
        }),
      )
    }

    setRawTableData(updatedData)
    setLoadingAllGroupsSchedule(false)
  }

  return (
    <>
      <Divider>Заполните форму:</Divider>
      <Form
        layout="vertical"
        form={form}
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
    </>
  )
}
