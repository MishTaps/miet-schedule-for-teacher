import { Layout } from 'antd'
import './App.css'
import { Footer, Header, MainWorkplace } from './components'
import { Content } from 'antd/es/layout/layout'

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content>
        <MainWorkplace />
      </Content>
      <Footer />
    </Layout>
  )
}

export default App
