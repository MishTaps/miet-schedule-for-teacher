import { Divider, Switch, Tooltip } from 'antd'
import './MoreSettings.css'

interface MoreSettingsProps {
  hideEmptyDaysTypes: boolean
  setHideEmptyDaysTypes: (value: boolean) => void
  hideEmptyRows: boolean
  setHideEmptyRows: (value: boolean) => void
}

export const MoreSettings: React.FC<MoreSettingsProps> = ({
  hideEmptyDaysTypes,
  setHideEmptyDaysTypes,
  hideEmptyRows,
  setHideEmptyRows,
}) => {
  return (
    <div>
      <Divider>Расширенные настройки:</Divider>
      <div style={{ margin: '0 auto', maxWidth: '400px' }}>
        <Tooltip title="Функция будет доступна в следующих версиях">
          <div className="rowStyle">
            <span style={{ color: 'lightgray' }}>
              Скрыть дни, числители, знаменатели без занятий
            </span>
            <Switch checked={hideEmptyDaysTypes} onChange={setHideEmptyDaysTypes} disabled />
          </div>
        </Tooltip>
        <div className="rowStyle">
          <span>Скрыть пары без занятий</span>
          <Switch checked={hideEmptyRows} onChange={setHideEmptyRows} />
        </div>
      </div>
    </div>
  )
}
