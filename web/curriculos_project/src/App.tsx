
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes/routes'
import { GlobalStyles } from './styles/GlobalStyles'

function App() {

  return (
    <BrowserRouter>
      <GlobalStyles />
        <Routes />
    </BrowserRouter>
  )
}

export default App
