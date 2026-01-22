import { Button, Result } from 'antd'
import { ExportOutlined } from '@ant-design/icons'
import { messages } from './messages'

interface LoadGroupsAlert {
  isOpenedOnFreeServer: boolean
}

export const ServerErrorAlert: React.FC<LoadGroupsAlert> = ({ isOpenedOnFreeServer }) => {
  return (
    <Result
      status="500"
      title="Ошибка сервера"
      subTitle={isOpenedOnFreeServer ? messages.onlineServer : messages.localServer}
      extra={
        isOpenedOnFreeServer ? (
          <Button
            type="primary"
            href="https://github.com/MishTaps/miet-schedule-for-teacher/tree/main?tab=readme-ov-file#%D0%B7%D0%B0%D0%BF%D1%83%D1%81%D0%BA-%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D1%8B-%D0%BB%D0%BE%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE"
            target="_blank"
          >
            Узнать, как развернуть локально <ExportOutlined />
          </Button>
        ) : null
      }
    />
  )
}
