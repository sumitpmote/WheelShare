import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './routes/Routes'
import AppNavbar from './components/Navbar'
import Footer from './components/Footer'
import ToastContainer from './components/ToastContainer'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'

function App() {

  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="app-container">
            <AppNavbar />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
