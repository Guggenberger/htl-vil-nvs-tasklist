import './App.css';
import { BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Logout from './components/Logout';
import Profil from './components/Profile';
import UserTable from './components/UserTable';
import reactDom from 'react-dom';
import Tasklist from './components/Tasklist.jsx';
import Form from './components/Form.jsx';
import Assign from './components/Assign.jsx';

function App() {
  let navItems = [     
    { title:'Login',  	    to:'/login',      component:Login,      auth: false,  admin: false },
    { title:'Tasklist',     to:'/tasklist',   component:Tasklist,   auth: true,   admin: false },
    { title:'Registrieren', to:'/register',   component:Form,       auth: true,   admin: true  },
    { title:'Eintragen',    to:'/assign',     component:Assign,     auth: true,   admin: true  },
    { title:'Profil',  	    to:'/profil',     component:Profil,     auth: true,   admin: false },
    { title:'Logout',  	    to:'/logout',     component:Logout,     auth: true,   admin: false },
  ]

  const secureItems = () => {
    var onlyAuthItems = false;
    var adminMode = false;
    var secureItemlist = [];
    var counter = 0;

    if ( window.sessionStorage.getItem("authenticationToken") !== null ) {
     onlyAuthItems = true;
    }

    if (window.sessionStorage.getItem("adminMode") === "admin") {
      adminMode = true;
    }

    navItems.forEach(item => {
      if (onlyAuthItems && item.auth) {
        if (adminMode && item.admin) {
          secureItemlist[counter] = item;
          counter++;
        } else if (!item.admin) {
          secureItemlist[counter] = item;
          counter++;
        }
      } else if (!onlyAuthItems && !item.auth) {
          secureItemlist[counter] = item;
          counter++;
      }
    });
    return secureItemlist;    
  }

  return ( 
    <BrowserRouter>
      <NavBar 
        brandItem={{ title:'Projekt Autark', to:'/' }}
        navItems={ secureItems() } 
      ></NavBar>

      <main>
        <Switch>
        <Route exact path="/">
          <Redirect to="/login"/>
        </Route>
          {secureItems() && secureItems().map((item) => (
            <Route
              exact
              key={item.to}
              path={item.to}
              component={item.component}
            ></Route>
          ))}
        </Switch>
      </main>
    </BrowserRouter>
  ); 
}
export default App;
