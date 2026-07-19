import { Flex, Select } from 'antd'
import styles from './Header.module.css'
import { useTranslation } from 'react-i18next'

export const Header = () => {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <header>
      <Flex justify="space-between" align="center">
        <Flex align="center" gap="middle">
          <img src="logo.svg" className={styles.logo} />
          <div>{t('header')}</div>
        </Flex>
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          className={styles.select}
          options={[
            {
              value: 'ru',
              label: (
                <span>
                  <img src="/ru-flag.svg" className={styles.flag} />
                  Русский
                </span>
              ),
            },
            {
              value: 'en',
              label: (
                <span>
                  <img src="/en-flag.svg" className={styles.flag} />
                  English (beta)
                </span>
              ),
            },
          ]}
        />
      </Flex>
    </header>
  )
}
