import { Layout } from 'antd'
import './App.css'
import { Footer, Header, MainWorkplace } from './components'
import { Content } from 'antd/es/layout/layout'
import { useMemo } from 'react'

function App() {
  const isOpenedOnFreeServer = useMemo(
    () => window.location.hostname === 'miet-schedule-for-teacher.vercel.app',
    [],
  )

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content>
        <MainWorkplace isOpenedOnFreeServer={isOpenedOnFreeServer} />
      </Content>
      <Footer isOpenedOnFreeServer={isOpenedOnFreeServer} />
    </Layout>
  )
}

export default App
