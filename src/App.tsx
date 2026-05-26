import { ConfigProvider, Layout } from 'antd'
import './App.css'
import { Footer, Header, MainWorkplace } from './components'
import { Content } from 'antd/es/layout/layout'
import ruRU from 'antd/locale/ru_RU'

import './i18n'

function App() {
  return (
    <ConfigProvider locale={ruRU}>
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
