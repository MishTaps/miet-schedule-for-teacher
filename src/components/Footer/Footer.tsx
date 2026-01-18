import './Footer.css'
import { GithubOutlined } from '@ant-design/icons'

interface Footer {
  isOpenedOnFreeServer: boolean
}

export const Footer: React.FC<Footer> = ({ isOpenedOnFreeServer }) => {
  return (
    <footer>
      <p>
        Это <u>не официальный</u> сайт администрации университета, а просто небольшой проект для
        студентов и преподавателей для расширения функционала просмотра расписания.
      </p>
      {isOpenedOnFreeServer ? (
        <p>
          Если возникли какие-то проблемы или вопросы (а также для развёртывания более стабильного
          приложения локально):
        </p>
      ) : (
        <p>Если возникли какие-то проблемы или вопросы:</p>
      )}

      <div>
        <GithubOutlined />
        <a href="https://github.com/MishTaps/miet-schedule-for-teacher"> Ссылка на проект GitHub</a>
      </div>
    </footer>
  )
}
