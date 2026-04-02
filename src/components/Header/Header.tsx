import { Flex } from 'antd'
import styles from './Header.module.css'

export const Header = () => {
  return (
    <header>
      <Flex align="center" gap="middle">
        <img src="logo.svg" />
        <div className={styles.title}>Расписание преподавателей</div>
      </Flex>
    </header>
  )
}
