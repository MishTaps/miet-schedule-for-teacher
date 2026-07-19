import { useEffect, useState } from 'react'
import { Button, Flex, Tooltip } from 'antd'
import styles from './Footer.module.css'
import { GithubFilled, CloudDownloadOutlined, GiftOutlined } from '@ant-design/icons'
import { Trans, useTranslation } from 'react-i18next'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  prompt(): Promise<void>
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

export const Footer = () => {
  const { t, i18n } = useTranslation()

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallAvailable, setIsInstallAvailable] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setIsInstallAvailable(true)
    }

    const handlePWAInstalled = () => {
      setDeferredPrompt(null)
      setIsInstallAvailable(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handlePWAInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handlePWAInstalled)
    }
  }, [])

  const installPWA = async () => {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice

    if (choice.outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsInstallAvailable(false)
    }
  }

  return (
    <footer>
      <p key={i18n.language}>
        <Trans i18nKey="footer.info" components={{ bold: <b /> }} />
      </p>
      <Flex gap="small" wrap>
        <Button
          icon={<GithubFilled />}
          size="small"
          href="https://github.com/MishTaps/miet-schedule-for-teacher"
          target="_blank"
        >
          {t('footer.button.github')}
        </Button>
        <Button
          icon={<img src="/tg-icon.svg" className={styles.icon} />}
          size="small"
          href="https://t.me/mietScheduleTeacherFeedbackBot"
          target="_blank"
        >
          {t('footer.button.telegram')}
        </Button>
        <Tooltip title={!isInstallAvailable && t('footer.button.downloadPWA.tooltip')}>
          <Button
            icon={<CloudDownloadOutlined />}
            size="small"
            onClick={installPWA}
            disabled={!isInstallAvailable}
          >
            {t('footer.button.downloadPWA.text')}
          </Button>
        </Tooltip>
        <Button
          icon={<GiftOutlined />}
          size="small"
          href="https://pay.cloudtips.ru/p/c9614daa"
          target="_blank"
        >
          Поддержать автора
        </Button>
      </Flex>
    </footer>
  )
}
