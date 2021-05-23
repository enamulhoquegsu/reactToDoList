import './App.css';
import './Todolist.css'
import Header from './components/Header';
import Footer from './components/Footer';

import {
 BrowserRouter,
 Switch,
 Route,
 Link
} from "react-router-dom";

import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import EditScreen from './screens/EditScreen';
function App() {

  return (
    <BrowserRouter>
    <div className="App">
      <Header />
      <Switch>
        <Route path='/' component={HomeScreen} exact></Route>
      </Switch>
      <Switch>
        <Route path='/category/:categoryName' component={CategoryScreen}></Route>
      </Switch>
      <Switch>
        <Route path="/item/edit/:id" component={EditScreen}></Route>
      </Switch>
      <Footer />
    </div>
    </BrowserRouter>
  );
}

export default App;


