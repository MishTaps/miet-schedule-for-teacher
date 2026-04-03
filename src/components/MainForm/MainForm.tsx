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
import styles from './MainForm.module.css'
import { useMemo } from 'react'
import { HeartFilled, HeartOutlined, UserOutlined } from '@ant-design/icons'
import type { SelectedDayOfWeekType, SelectedWeekType } from '@/types'
import localforage from 'localforage'
import type { DefaultOptionType } from 'antd/es/select'
import { useFiltrationSettingsStore, useTeachersStore, useVisualSettingsStore } from '@/stores'

export const MainForm = () => {
  const teachers = useTeachersStore((state) => state.teachers)
  const selectedTeacher = useTeachersStore((state) => state.selectedTeacher)
  const favoriteTeachers = useTeachersStore((state) => state.favoriteTeachers)
  const setSelectedTeacher = useTeachersStore((state) => state.setSelectedTeacher)
  const setFavoriteTeachers = useTeachersStore((state) => state.setFavoriteTeachers)

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

  const selectTeacher = (value: string) => {
    setSelectedTeacher(value)
    ;(document.activeElement as HTMLElement)?.blur()
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

  return (
    <>
      <Divider>Заполните форму:</Divider>
      <Form layout="vertical" className={styles.form}>
        <Form.Item label="Выберите преподавателя:" className={styles.select}>
          <Select
            showSearch
            virtual
            placeholder="Иванов Иван Иванович"
            options={teacherOptions}
            onSelect={selectTeacher}
            prefix={<UserOutlined />}
            value={selectedTeacher}
            optionRender={(option) => (
              <Space className={styles.teacherItem}>
                {option.label}
                <div onClick={(e) => toggleFavorite(e, option.value as string)}>
                  {favoriteTeachers.includes(option.value as string) ? (
                    <HeartFilled className={styles.favorite} />
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
        <Flex wrap="wrap" className={styles.settingsBox}>
          <FiltrationSettings />
          <VisualSettings />
        </Flex>
      </Form>
    </>
  )
}

const FiltrationSettings = () => {
  const selectedDayOfWeek = useFiltrationSettingsStore((state) => state.selectedDayOfWeek)
  const selectedWeekType = useFiltrationSettingsStore((state) => state.selectedWeekType)
  const setSelectedDayOfWeek = useFiltrationSettingsStore((state) => state.setSelectedDayOfWeek)
  const setSelectedWeekType = useFiltrationSettingsStore((state) => state.setSelectedWeekType)

  const setSortColumnType = useVisualSettingsStore((state) => state.setSortColumnType)

  return (
    <div className={styles.settingsBody}>
      <Divider>Фильтрация</Divider>
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
    </div>
  )
}

const VisualSettings = () => {
  const hideEmptyDaysTypes = useVisualSettingsStore((state) => state.hideEmptyDaysTypes)
  const hideEmptyRows = useVisualSettingsStore((state) => state.hideEmptyRows)
  const hideTimeColumn = useVisualSettingsStore((state) => state.hideTimeColumn)
  const setHideEmptyDaysTypes = useVisualSettingsStore((state) => state.setHideEmptyDaysTypes)
  const setHideEmptyRows = useVisualSettingsStore((state) => state.setHideEmptyRows)
  const setHideTimeColumn = useVisualSettingsStore((state) => state.setHideTimeColumn)
  const sortColumnType = useVisualSettingsStore((state) => state.sortColumnType)
  const setSortColumnType = useVisualSettingsStore((state) => state.setSortColumnType)

  const selectedDayOfWeek = useFiltrationSettingsStore((state) => state.selectedDayOfWeek)
  const selectedWeekType = useFiltrationSettingsStore((state) => state.selectedWeekType)

  return (
    <div className={styles.settingsBody}>
      <Divider>Настройки отображения</Divider>
      <Form.Item label="Сортировка по:" name="sortType" initialValue="day">
        <Tooltip
          title={
            selectedDayOfWeek !== 'allDays' || selectedWeekType !== 'allWeekTypes'
              ? 'Сортировка доступна только при выключенных фильтрах'
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
      <div className={styles.switch}>
        <span>Скрыть дни, числители, знаменатели без занятий</span>
        <Switch checked={hideEmptyDaysTypes} onChange={setHideEmptyDaysTypes} />
      </div>
      <div className={styles.switch}>
        <span>Скрыть пары без занятий</span>
        <Switch checked={hideEmptyRows} onChange={setHideEmptyRows} />
      </div>
      <div className={styles.switch}>
        <span>Скрыть столбец «Пары»</span>
        <Switch checked={hideTimeColumn} onChange={setHideTimeColumn} />
      </div>
    </div>
  )
}
