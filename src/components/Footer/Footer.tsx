import './Footer.css'
import { GithubOutlined } from '@ant-design/icons'

export const Footer = () => {
  return (
    <footer>
      <div>
        Это <u>не официальный</u> сайт администрации университета, а просто небольшой проект для
        студентов и преподавателей для расширения функционала просмотра расписания.
      </div>
      <p>
        <GithubOutlined />
        <a href="https://github.com/MishTaps/miet-schedule-for-teacher"> Ссылка на проект GitHub</a>
      </p>
    </footer>
  )
}
