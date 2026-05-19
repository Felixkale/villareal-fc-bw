import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Admin from './Admin'

// Route /admin to Admin panel, everything else to App
const isAdmin = window.location.pathname.startsWith('/admin')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdmin ? <Admin /> : <App />}
  </React.StrictMode>
)
