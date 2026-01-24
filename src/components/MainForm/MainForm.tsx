import { Divider, Empty, Form, Radio, Select, Switch, Tooltip } from 'antd'
import './MainForm.css'
import { useMemo } from 'react'
import { UserOutlined } from '@ant-design/icons'

interface MainForm {
  teachers: string[]
  setSelectedTeacher: (value: string | null) => void
  setSelectedWeekType: (value: string) => void
  hideEmptyDaysTypes: boolean
  hideEmptyRows: boolean
  hideTimeColumn: boolean
  setHideEmptyDaysTypes: (value: boolean) => void
  setHideEmptyRows: (value: boolean) => void
  setHideTimeColumn: (value: boolean) => void
  setSortColumnType: (value: string) => void
  selectedWeekType: string
  sortColumnType: string
}

export const MainForm: React.FC<MainForm> = ({
  teachers,
  setSelectedTeacher,
  hideEmptyDaysTypes,
  setHideEmptyDaysTypes,
  hideEmptyRows,
  setHideEmptyRows,
  setSelectedWeekType,
  hideTimeColumn,
  setHideTimeColumn,
  setSortColumnType,
  selectedWeekType,
  sortColumnType,
}) => {
  const teacherOptions = useMemo(() => teachers.map((t) => ({ label: t, value: t })), [teachers])

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
            notFoundContent={
              <Empty
                description="Преподаватели не найдены"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              ></Empty>
            }
          />
        </Form.Item>
        <Form.Item label="Выберите тип недели:" name="weekType" initialValue="allWeekTypes">
          <Select
            options={[
              { value: 'weekType0', label: 'Числитель I' },
              { value: 'weekType1', label: 'Знаменатель I' },
              { value: 'weekType2', label: 'Числитель II' },
              { value: 'weekType3', label: 'Знаменатель II' },
              { value: 'allWeekTypes', label: 'Полное расписание' },
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
              selectedWeekType !== 'allWeekTypes' &&
              'Сортировка доступна только в режиме «Полное расписание»'
            }
          >
            <div>
              <Radio.Group
                block
                disabled={selectedWeekType !== 'allWeekTypes'}
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
