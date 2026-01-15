import { Flex } from 'antd'
import './Header.css'

export const Header = () => {
  return (
    <header>
      <Flex align="center" gap="middle">
        <img src="logo.svg" alt="logo" />
        <div style={{ textAlign: 'right' }}>Расписание преподавателей</div>
      </Flex>
    </header>
  )
}
