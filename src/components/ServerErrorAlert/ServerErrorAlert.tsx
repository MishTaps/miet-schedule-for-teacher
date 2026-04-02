import { Result } from 'antd'
import { messages } from './messages'

export const ServerErrorAlert = () => {
  return <Result status="500" title="Ошибка сервера" subTitle={messages.serverError()} />
}
