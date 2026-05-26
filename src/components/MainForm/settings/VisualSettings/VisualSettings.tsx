import { useVisualSettingsStore, useFiltrationSettingsStore } from '@/stores'
import { Divider, Form, Tooltip, Radio, Switch } from 'antd'
import styles from '../settings.module.css'
import type { RadioChangeEvent } from 'antd/lib'
import { useTranslation } from 'react-i18next'

export const VisualSettings = () => {
  const { t } = useTranslation()

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
    { label: t('mainForm.visual.sort.sortType.day'), value: 'day' },
    { label: t('mainForm.visual.sort.sortType.week'), value: 'week' },
  ]

  const handleSelectSortType = (e: RadioChangeEvent) => {
    setSortColumnType(e.target.value)
  }

  return (
    <div className={styles.settingsBody}>
      <Divider>{t('mainForm.visual.header')}</Divider>
      <Form.Item label={t('mainForm.visual.sort.label')} name="sortType">
        <Tooltip title={areFiltersUsed && t('mainForm.visual.sort.tooltip')}>
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
        <span>{t('mainForm.visual.noColumns')}</span>
        <Switch checked={hideEmptyDaysTypes} onChange={setHideEmptyDaysTypes} />
      </div>
      <div className={styles.switch}>
        <span>{t('mainForm.visual.noRows')}</span>
        <Switch checked={hideEmptyRows} onChange={setHideEmptyRows} />
      </div>
      <div className={styles.switch}>
        <span>{t('mainForm.visual.noTime')}</span>
        <Switch checked={hideTimeColumn} onChange={setHideTimeColumn} />
      </div>
    </div>
  )
}
