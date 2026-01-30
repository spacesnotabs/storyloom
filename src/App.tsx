import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { StoryPage } from './pages/StoryPage'
import { RequireAuth } from './routes/RequireAuth'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      <Route
        path="/stories/:storyId"
        element={
          <RequireAuth>
            <StoryPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  )
}

export default App
