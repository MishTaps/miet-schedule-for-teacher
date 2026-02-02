import './Footer.css'
import { GithubOutlined } from '@ant-design/icons'

export const Footer = () => {
  return (
    <footer>
      <p>
        Это <u>не официальный</u> сайт администрации университета, а просто небольшой проект для
        студентов и преподавателей для расширения функционала просмотра расписания.
      </p>
      <p>Полезные ссылки и обратная связь:</p>

      <div className="footer-links">
        <div>
          <a href="https://github.com/MishTaps/miet-schedule-for-teacher" target="_blank">
            <GithubOutlined style={{ color: 'black', paddingRight: '2px' }} />
            Проект GitHub
          </a>
        </div>
        <div>
          <a href="https://t.me/MishTaps" target="_blank" style={{ display: 'inline-flex' }}>
            <img src="/tg-icon.svg" width="16" height="16"></img>
            Telegram
          </a>
        </div>
        <div>
          <a href="https://vk.com/mishtaps" target="_blank" style={{ display: 'inline-flex' }}>
            <img src="/vk-icon.svg" width="16" height="16"></img>
            ВКонтакте
          </a>
        </div>
      </div>
    </footer>
  )
}
