import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import ProjectPage from './pages/ProjectPage'
import Layout from './components/Layout'

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </>
  )
}

export default App