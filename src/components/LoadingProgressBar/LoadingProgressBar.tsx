import { Progress } from 'antd'
interface LoadingProgressBar {
  groupScannedPercent: number
  isOpenedOnFreeServer: boolean
  scanningGroupsSchedule: boolean
}

export const LoadingProgressBar: React.FC<LoadingProgressBar> = ({
  groupScannedPercent,
  isOpenedOnFreeServer,
  scanningGroupsSchedule,
}) => {
  return (
    <>
      <div style={{ padding: '0 30px 20px', textAlign: 'center' }}>
        {isOpenedOnFreeServer && (
          <div style={{ padding: '10px 0 5px' }}>
            <p>
              Текущее приложение открыто на <u>бесплатном хостинге</u>, из-за чего может быть низкая
              скорость загрузки и ограничение на количество запросов в месяц.
            </p>
            <p>
              Для более стабильной работы лучше развернуть приложение локально (см.{' '}
              <a href="https://github.com/MishTaps/miet-schedule-for-teacher" target="_blank">
                проект GitHub
              </a>
              ).
            </p>
          </div>
        )}
        <Progress
          percent={groupScannedPercent}
          status={scanningGroupsSchedule ? 'active' : 'exception'}
          percentPosition={{ align: 'center' }}
          style={{ padding: '5px 0' }}
        />
      </div>
    </>
  )
}
