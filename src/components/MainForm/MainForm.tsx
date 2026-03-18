import {
  Button,
  Divider,
  Empty,
  Flex,
  Form,
  message,
  Radio,
  Select,
  Space,
  Switch,
  Tooltip,
} from 'antd'
import './MainForm.css'
import { useMemo } from 'react'
import { HeartFilled, HeartOutlined, UserOutlined } from '@ant-design/icons'
import type { SelectedDayOfWeekType, SelectedWeekType, SortColumnType } from '@/types'
import localforage from 'localforage'
import type { DefaultOptionType } from 'antd/es/select'

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
  favoriteTeachers: string[]
  setFavoriteTeachers: (value: string[]) => void
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
  favoriteTeachers,
  setFavoriteTeachers,
}) => {
  const teacherOptions = useMemo<DefaultOptionType[]>(() => {
    if (favoriteTeachers.length === 0) {
      return teachers.map((t) => ({ label: t, value: t }))
    }

    const favoriteOptions = teachers
      .filter((t) => favoriteTeachers.includes(t))
      .map((t) => ({ label: t, value: t }))
    const otherOptions = teachers
      .filter((t) => !favoriteTeachers.includes(t))
      .map((t) => ({ label: t, value: t }))

    return [
      { label: 'Избранные', options: favoriteOptions },
      { label: 'Остальные преподаватели', options: otherOptions },
    ]
  }, [teachers, favoriteTeachers])

  const url = new URL(window.location.href)
  if (selectedTeacher) {
    url.searchParams.set('teacher', selectedTeacher)
    window.history.replaceState({}, '', url)
  }

  const toggleFavorite = async (e: React.MouseEvent<HTMLSpanElement>, value: string) => {
    e.stopPropagation()

    const isFavorite = favoriteTeachers.includes(value)
    const deleteFromFavorites = favoriteTeachers.filter((id) => id !== value)
    const addToFavorites = [...favoriteTeachers, value]

    const newList = isFavorite ? deleteFromFavorites : addToFavorites
    setFavoriteTeachers(newList)

    try {
      const currentCache = (await localforage.getItem('personal_data')) || {}
      await localforage.setItem('personal_data', {
        ...currentCache,
        favoriteTeachers: newList,
      })
    } catch (err) {
      console.error('Ошибка сохранения personal_data в кэше:', err)
    }
  }

  const filtrationSettings = (
    <>
      <Divider style={{ marginTop: 0 }}>Фильтрация</Divider>
      <Form.Item label="Выберите день недели:">
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
      <Form.Item label="Выберите тип недели:">
        <Select<SelectedWeekType>
          options={[
            { value: 'weekType0', label: 'Числитель I' },
            { value: 'weekType1', label: 'Знаменатель I' },
            { value: 'weekType2', label: 'Числитель II' },
            { value: 'weekType3', label: 'Знаменатель II' },
            { value: 'allWeekTypes', label: 'Все типы недель' },
          ]}
          value={selectedWeekType}
          onChange={(value) => {
            setSelectedWeekType(value)
            setSortColumnType('day')
          }}
        />
      </Form.Item>
    </>
  )

  const visualSettings = (
    <>
      <Divider style={{ marginTop: 0 }}>Настройки отображения</Divider>
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
    </>
  )

  return (
    <div>
      <Divider>Заполните форму:</Divider>
      <Form layout="vertical" style={{ margin: '0 auto', padding: '0 20px' }}>
        <Form.Item label="Выберите преподавателя:" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Select
            showSearch
            virtual
            placeholder="Иванов Иван Иванович"
            options={teacherOptions}
            onSelect={(value) => {
              setSelectedTeacher(value)
              ;(document.activeElement as HTMLElement)?.blur()
            }}
            prefix={<UserOutlined />}
            value={selectedTeacher}
            optionRender={(option) => (
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                {option.label}
                <div onClick={(e) => toggleFavorite(e, option.value as string)}>
                  {favoriteTeachers.includes(option.value as string) ? (
                    <HeartFilled style={{ color: '#ff4d4f' }} />
                  ) : (
                    <HeartOutlined />
                  )}
                </div>
              </Space>
            )}
            notFoundContent={
              <Empty
                description="Преподаватели не найдены"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              ></Empty>
            }
          />
        </Form.Item>
        <Flex wrap="wrap" style={{ marginTop: 16 }}>
          <div className="flexItem">{filtrationSettings}</div>
          <div className="flexItem">{visualSettings}</div>
        </Flex>
      </Form>
    </div>
  )
}
