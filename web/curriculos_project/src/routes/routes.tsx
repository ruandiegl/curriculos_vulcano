import Dashboard from '../pages/dashboard/index.tsx';
import { Route, Switch } from 'react-router-dom'
import Login from '../pages/Login/index.tsx';

export function Routes() {
  return (
    <Switch>
      <Route path='/login' component={Login} />
      <Route path='/Dashboard' component={Dashboard} />
    </Switch>
  )
}
