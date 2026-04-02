import styles from './Footer.module.css'
import { GithubOutlined } from '@ant-design/icons'

export const Footer = () => {
  return (
    <footer>
      <p>
        Это <u>не официальный</u> сайт администрации университета, а просто небольшой проект для
        студентов и преподавателей для расширения функционала просмотра расписания.
      </p>
      <p>Полезные ссылки и обратная связь:</p>

      <div className={styles.footerLinks}>
        <div>
          <a href="https://github.com/MishTaps/miet-schedule-for-teacher" target="_blank">
            <GithubOutlined className={styles.githubIcon} />
            Проект GitHub
          </a>
        </div>
        <div>
          <a
            href="https://t.me/mietScheduleTeacherFeedbackBot"
            target="_blank"
            className={styles.telegramLink}
          >
            <img src="/tg-icon.svg" width="16" height="16"></img>
            Telegram
          </a>
        </div>
      </div>
    </footer>
  )
}
