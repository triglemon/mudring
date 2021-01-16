import logo from './logo.svg';
import './App.css';
import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import Home from './components/Home';
import {BrowserRouter , Switch, Route, Redirect} from 'react-router-dom'; 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path="/" exact >
            <Redirect to="/home" />
          </Route>
          <Route path='/home'>
            <Home/> 
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
