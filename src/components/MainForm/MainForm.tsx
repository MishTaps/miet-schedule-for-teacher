import { Button, Divider, Empty, Flex, Form, message, Radio, Select, Switch, Tooltip } from 'antd'
import './MainForm.css'
import { useMemo } from 'react'
import { UserOutlined } from '@ant-design/icons'
import type { SelectedDayOfWeekType, SelectedWeekType, SortColumnType } from '@/types'

interface MainForm {
  teachers: string[]
  setSelectedTeacher: (value: string | null) => void
  setSelectedWeekType: (value: SelectedWeekType) => void
  setSelectedDayOfWeek: (value: SelectedDayOfWeekType) => void
  hideEmptyDaysTypes: boolean
  hideEmptyRows: boolean
  hideTimeColumn: boolean
  setHideEmptyDaysTypes: (value: boolean) => void
  setHideEmptyRows: (value: boolean) => void
  setHideTimeColumn: (value: boolean) => void
  setSortColumnType: (value: SortColumnType) => void
  selectedDayOfWeek: SelectedDayOfWeekType
  selectedWeekType: SelectedWeekType
  sortColumnType: SortColumnType
  selectedTeacher: string | null
}

export const MainForm: React.FC<MainForm> = ({
  teachers,
  setSelectedTeacher,
  hideEmptyDaysTypes,
  setHideEmptyDaysTypes,
  hideEmptyRows,
  setHideEmptyRows,
  setSelectedWeekType,
  setSelectedDayOfWeek,
  hideTimeColumn,
  setHideTimeColumn,
  setSortColumnType,
  selectedDayOfWeek,
  selectedWeekType,
  sortColumnType,
  selectedTeacher,
}) => {
  const teacherOptions = useMemo(() => teachers.map((t) => ({ label: t, value: t })), [teachers])

  const url = new URL(window.location.href)
  if (selectedTeacher) {
    url.searchParams.set('teacher', selectedTeacher)
    window.history.replaceState({}, '', url)
  }

  return (
    <div>
      <Divider>Заполните форму:</Divider>
      <Form layout="vertical" style={{ maxWidth: '500px', margin: '0 auto', padding: '0 20px' }}>
        <Form.Item label="Выберите преподавателя:">
          <Select
            showSearch
            virtual
            listHeight={256}
            listItemHeight={32}
            getPopupContainer={(trigger) => trigger.parentElement}
            placeholder="Иванов Иван Иванович"
            options={teacherOptions}
            onSelect={(value) => {
              setSelectedTeacher(value)
              ;(document.activeElement as HTMLElement)?.blur()
            }}
            prefix={<UserOutlined />}
            value={selectedTeacher}
            notFoundContent={
              <Empty
                description="Преподаватели не найдены"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              ></Empty>
            }
          />
        </Form.Item>
        <Form.Item label="Выберите день недели:" name="dayOfWeek">
          <Flex>
            <Select<SelectedDayOfWeekType>
              options={[
                { value: 'day1', label: 'Понедельник' },
                { value: 'day2', label: 'Вторник' },
                { value: 'day3', label: 'Среда' },
                { value: 'day4', label: 'Четверг' },
                { value: 'day5', label: 'Пятница' },
                { value: 'day6', label: 'Суббота' },
                { value: 'allDays', label: 'Все дни недели' },
              ]}
              value={selectedDayOfWeek}
              onChange={(value) => {
                setSelectedDayOfWeek(value)
                setSortColumnType('day')
              }}
            />
            <Button
              type="link"
              onClick={() => {
                const today = new Date().getDay() || 7
                if (today == 7) {
                  message.warning(
                    'Сегодня воскресенье, занятий нет. Показано расписание на всю неделю.',
                    5,
                  )
                  setSelectedDayOfWeek('allDays')
                  return
                }
                setSelectedDayOfWeek(('day' + (new Date().getDay() || 7)) as SelectedDayOfWeekType)
                setSortColumnType('day')
              }}
            >
              Сегодня
            </Button>
          </Flex>
        </Form.Item>
        <Form.Item label="Выберите тип недели:" name="weekType">
          <Select<SelectedWeekType>
            options={[
              { value: 'weekType0', label: 'Числитель I' },
              { value: 'weekType1', label: 'Знаменатель I' },
              { value: 'weekType2', label: 'Числитель II' },
              { value: 'weekType3', label: 'Знаменатель II' },
              { value: 'allWeekTypes', label: 'Все типы недель' },
            ]}
            defaultValue="allWeekTypes"
            onChange={(value) => {
              setSelectedWeekType(value)
              setSortColumnType('day')
            }}
          />
        </Form.Item>
        <Form.Item label="Сортировка по:" name="sortType" initialValue="day">
          <Tooltip
            title={
              selectedDayOfWeek !== 'allDays' || selectedWeekType !== 'allWeekTypes'
                ? 'Сортировка доступна только при выборе всех дней недели и всех типов недель'
                : undefined
            }
          >
            <div>
              <Radio.Group
                block
                disabled={selectedDayOfWeek !== 'allDays' || selectedWeekType !== 'allWeekTypes'}
                options={[
                  { label: 'Дням недели', value: 'day' },
                  { label: 'Типам недели', value: 'week' },
                ]}
                style={{ whiteSpace: 'normal' }}
                defaultValue="day"
                value={sortColumnType}
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => {
                  setSortColumnType(e.target.value)
                }}
              />
            </div>
          </Tooltip>
        </Form.Item>
        <div className="rowStyle">
          <span>Скрыть дни, числители, знаменатели без занятий</span>
          <Switch checked={hideEmptyDaysTypes} onChange={setHideEmptyDaysTypes} />
        </div>
        <div className="rowStyle">
          <span>Скрыть пары без занятий</span>
          <Switch checked={hideEmptyRows} onChange={setHideEmptyRows} />
        </div>
        <div className="rowStyle">
          <span>Скрыть столбец «Пары»</span>
          <Switch checked={hideTimeColumn} onChange={setHideTimeColumn} />
        </div>
      </Form>
    </div>
  )
}
