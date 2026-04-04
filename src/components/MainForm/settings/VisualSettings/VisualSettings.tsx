import { useVisualSettingsStore, useFiltrationSettingsStore } from '@/stores'
import { Divider, Form, Tooltip, Radio, Switch } from 'antd'
import styles from '../settings.module.css'
import type { RadioChangeEvent } from 'antd/lib'

export const VisualSettings = () => {
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

  const areFiltersUsed = selectedDayOfWeek !== 'allDays' || selectedWeekType !== 'allWeekTypes'

  const selectSortType = [
    { label: 'Дням недели', value: 'day' },
    { label: 'Типам недели', value: 'week' },
  ]

  const handleSelectSortType = (e: RadioChangeEvent) => {
    setSortColumnType(e.target.value)
  }

  return (
    <div className={styles.settingsBody}>
      <Divider>Настройки отображения</Divider>
      <Form.Item label="Сортировка по:" name="sortType">
        <Tooltip title={areFiltersUsed && 'Сортировка доступна только при выключенных фильтрах'}>
          <Radio.Group
            block
            disabled={areFiltersUsed}
            options={selectSortType}
            value={sortColumnType}
            optionType="button"
            buttonStyle="solid"
            onChange={handleSelectSortType}
          />
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
