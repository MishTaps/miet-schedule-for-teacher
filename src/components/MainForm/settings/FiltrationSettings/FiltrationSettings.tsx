import { useFiltrationSettingsStore, useVisualSettingsStore } from '@/stores'
import type { SelectedDayOfWeekType, SelectedWeekType } from '@/types'
import { Form, Button, Divider, Flex, Select, Tooltip } from 'antd'
import styles from '../settings.module.css'

export const FiltrationSettings = () => {
  const selectedDayOfWeek = useFiltrationSettingsStore((state) => state.selectedDayOfWeek)
  const selectedWeekType = useFiltrationSettingsStore((state) => state.selectedWeekType)
  const setSelectedDayOfWeek = useFiltrationSettingsStore((state) => state.setSelectedDayOfWeek)
  const setSelectedWeekType = useFiltrationSettingsStore((state) => state.setSelectedWeekType)

  const setSortColumnType = useVisualSettingsStore((state) => state.setSortColumnType)

  const today = new Date().getDay()
  const isTodaySunday = today === 0

  const selectableDays = [
    { value: 'day1', label: 'Понедельник' },
    { value: 'day2', label: 'Вторник' },
    { value: 'day3', label: 'Среда' },
    { value: 'day4', label: 'Четверг' },
    { value: 'day5', label: 'Пятница' },
    { value: 'day6', label: 'Суббота' },
    { value: 'allDays', label: 'Все дни недели' },
  ]

  const selectableWeekTypes = [
    { value: 'weekType0', label: 'Числитель I' },
    { value: 'weekType1', label: 'Знаменатель I' },
    { value: 'weekType2', label: 'Числитель II' },
    { value: 'weekType3', label: 'Знаменатель II' },
    { value: 'allWeekTypes', label: 'Все типы недель' },
  ]

  const handleSelectDay = (value: SelectedDayOfWeekType) => {
    setSelectedDayOfWeek(value)
    setSortColumnType('day')
  }

  const handleSelectWeekType = (value: SelectedWeekType) => {
    setSelectedWeekType(value)
    setSortColumnType('day')
  }

  const handleTodayClick = () => {
    setSelectedDayOfWeek(('day' + today) as SelectedDayOfWeekType)
    setSortColumnType('day')
  }

  return (
    <div className={styles.settingsBody}>
      <Divider>Фильтрация</Divider>
      <Form.Item label="Выберите день недели:">
        <Flex>
          <Select<SelectedDayOfWeekType>
            options={selectableDays}
            value={selectedDayOfWeek}
            onChange={handleSelectDay}
          />
          <Tooltip title={isTodaySunday && 'Сегодня воскресенье, занятий нет'}>
            <Button type="link" onClick={handleTodayClick} disabled={isTodaySunday}>
              Сегодня
            </Button>
          </Tooltip>
        </Flex>
      </Form.Item>
      <Form.Item label="Выберите тип недели:">
        <Select<SelectedWeekType>
          options={selectableWeekTypes}
          value={selectedWeekType}
          onChange={handleSelectWeekType}
        />
      </Form.Item>
    </div>
  )
}
