import Home from './components/Home'
import {BrowserRouter , Switch, Route , Redirect } from 'react-router-dom'; 
import Bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css';
function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact >
                        <Redirect to="/home" />
                    </Route>
                    <Route path="/home" exact >
                        <Home />
                    </Route>
                   
                </Switch>

            </BrowserRouter>
        </div>
    );
} export default App 