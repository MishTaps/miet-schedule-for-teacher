import { ConfigProvider, Layout } from 'antd'
import './App.css'
import { Footer, Header, MainWorkplace } from './components'
import { Content } from 'antd/es/layout/layout'
import ruRU from 'antd/locale/ru_RU'
import enUS from 'antd/locale/en_US'

import './i18n'
import { useTranslation } from 'react-i18next'

function App() {
  const { i18n } = useTranslation()

  return (
    <ConfigProvider locale={i18n.language === 'ru' ? ruRU : enUS}>
      <Layout className="layout">
        <Header />
        <Content>
          <main>
            <MainWorkplace />
          </main>
        </Content>
        <Footer />
      </Layout>
    </ConfigProvider>
  )
}

export default App
