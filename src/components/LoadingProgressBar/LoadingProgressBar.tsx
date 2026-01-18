import { Progress } from 'antd'
interface LoadingProgressBar {
  groupScannedPercent: number
  isOpenedOnFreeServer: boolean
}

export const LoadingProgressBar: React.FC<LoadingProgressBar> = ({
  groupScannedPercent,
  isOpenedOnFreeServer,
}) => {
  return (
    <>
      <div style={{ padding: '0 30px 20px', textAlign: 'center' }}>
        {isOpenedOnFreeServer && (
          <div style={{ padding: '10px 0 5px' }}>
            Текущее приложение открыто на <u>бесплатном хостинге</u>, из-за чего может быть низкая
            скорость загрузки и ограничение на количество запросов в месяц. Для более стабильной
            работы лучше развернуть приложение <u>локально</u> (см. подвал сайта).
          </div>
        )}
        <Progress
          percent={groupScannedPercent}
          status="active"
          percentPosition={{ align: 'center' }}
          style={{ padding: '5px 0' }}
        />
      </div>
    </>
  )
}
