import { Button, Flex, Tooltip } from 'antd'
import styles from './Footer.module.css'
import { GithubFilled, CloudDownloadOutlined } from '@ant-design/icons'

export const Footer = () => {
  return (
    <footer>
      <p>
        Это <b>не официальный</b> сайт администрации университета, а просто небольшой проект для
        студентов и преподавателей для расширения функционала просмотра расписания.
      </p>
      <Flex gap="small" wrap>
        <Button
          icon={<GithubFilled />}
          size="small"
          href="https://github.com/MishTaps/miet-schedule-for-teacher"
          target="_blank"
        >
          Проект GitHub
        </Button>
        <Button
          icon={<img src="/tg-icon.svg" className={styles.telegramImg} />}
          size="small"
          href="https://t.me/mietScheduleTeacherFeedbackBot"
          target="_blank"
        >
          Обратная связь
        </Button>
        <Tooltip title="В разработке... Будет доступно в ближайшее время">
          <Button icon={<CloudDownloadOutlined />} size="small" disabled>
            Скачать приложение (PWA)
          </Button>
        </Tooltip>
      </Flex>
    </footer>
  )
}
