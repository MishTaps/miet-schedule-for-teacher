import { Divider, Switch } from 'antd'
import './MoreSettings.css'

export const MoreSettings = () => {
  return (
    <div style={{ display: 'none' }}>
      <Divider>Расширенные настройки</Divider>
      <div style={{ width: '300', margin: '0 auto', maxWidth: '400px' }}>
        <div className="rowStyle">
          <span>Показывать дни недели, числители, знаменатели без занятий</span>
          <Switch disabled checked />
        </div>
        <div className="rowStyle">
          <span>Показывать пары (время и номер) без занятий</span>
          <Switch disabled checked />
        </div>
      </div>
    </div>
  )
}
