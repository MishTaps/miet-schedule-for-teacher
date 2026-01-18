import { Divider, Form, Select, Switch } from 'antd'
import './MainForm.css'
import { useMemo } from 'react'
interface MainForm {
  teachers: string[]
  setSelectedTeacher: (value: string | null) => void
  hideEmptyDaysTypes: boolean
  setHideEmptyDaysTypes: (value: boolean) => void
  hideEmptyRows: boolean
  setHideEmptyRows: (value: boolean) => void
  setSelectedWeekType: (value: string) => void
}

export const MainForm: React.FC<MainForm> = ({
  teachers,
  setSelectedTeacher,
  hideEmptyDaysTypes,
  setHideEmptyDaysTypes,
  hideEmptyRows,
  setHideEmptyRows,
  setSelectedWeekType,
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
            onChange={setSelectedTeacher}
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
            onChange={setSelectedWeekType}
          />
        </Form.Item>
        <div className="rowStyle">
          <span>Скрыть дни, числители, знаменатели без занятий</span>
          <Switch checked={hideEmptyDaysTypes} onChange={setHideEmptyDaysTypes} />
        </div>
        <div className="rowStyle">
          <span>Скрыть пары без занятий</span>
          <Switch checked={hideEmptyRows} onChange={setHideEmptyRows} />
        </div>
      </Form>
    </div>
  )
}
