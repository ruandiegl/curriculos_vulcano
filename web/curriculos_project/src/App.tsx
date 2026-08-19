

import { AppRoutes} from './routes/routes'
import { GlobalStyles } from './styles/GlobalStyles'
import CookieConsent from './components/CookieConsent'

function App() {

  return (
    <>
     <GlobalStyles />
      <AppRoutes />
      <CookieConsent />
    </>
    
  )
}

export default App
