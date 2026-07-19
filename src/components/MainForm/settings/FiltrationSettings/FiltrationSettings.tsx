import { useFiltrationSettingsStore, useVisualSettingsStore } from '@/stores'
import type { SelectedDayOfWeekType, SelectedWeekType } from '@/types'
import { Form, Button, Divider, Flex, Select, Tooltip } from 'antd'
import styles from '../settings.module.css'
import { useTranslation } from 'react-i18next'

export const FiltrationSettings = () => {
  const { t } = useTranslation()

  const selectedDayOfWeek = useFiltrationSettingsStore((state) => state.selectedDayOfWeek)
  const selectedWeekType = useFiltrationSettingsStore((state) => state.selectedWeekType)
  const setSelectedDayOfWeek = useFiltrationSettingsStore((state) => state.setSelectedDayOfWeek)
  const setSelectedWeekType = useFiltrationSettingsStore((state) => state.setSelectedWeekType)

  const setSortColumnType = useVisualSettingsStore((state) => state.setSortColumnType)

  const today = new Date().getDay()
  const isTodaySunday = today === 0

  const selectableDays = [
    { value: 'day1', label: t('days.day1.longName') },
    { value: 'day2', label: t('days.day2.longName') },
    { value: 'day3', label: t('days.day3.longName') },
    { value: 'day4', label: t('days.day4.longName') },
    { value: 'day5', label: t('days.day5.longName') },
    { value: 'day6', label: t('days.day6.longName') },
    { value: 'allDays', label: t('days.allDays') },
  ]

  const selectableWeekTypes = [
    { value: 'weekType0', label: t('weeks.weekType0.longName') },
    { value: 'weekType1', label: t('weeks.weekType1.longName') },
    { value: 'weekType2', label: t('weeks.weekType2.longName') },
    { value: 'weekType3', label: t('weeks.weekType3.longName') },
    { value: 'allWeekTypes', label: t('weeks.allWeekTypes') },
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
      <Divider>{t('mainForm.filtration.header')}</Divider>
      <Form.Item label={t('mainForm.filtration.day.label')}>
        <Flex>
          <Select<SelectedDayOfWeekType>
            options={selectableDays}
            value={selectedDayOfWeek}
            onChange={handleSelectDay}
          />
          <Tooltip title={isTodaySunday && t('mainForm.filtration.day.tooltip')}>
            <Button type="link" onClick={handleTodayClick} disabled={isTodaySunday}>
              {t('mainForm.filtration.day.today')}
            </Button>
          </Tooltip>
        </Flex>
      </Form.Item>
      <Form.Item label={t('mainForm.filtration.week.label')}>
        <Select<SelectedWeekType>
          options={selectableWeekTypes}
          value={selectedWeekType}
          onChange={handleSelectWeekType}
        />
      </Form.Item>
    </div>
  )
}
