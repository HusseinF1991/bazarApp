import { Redirect, useHistory } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import MainLayout from "./components/layout/mainLayout";
import Login from "./components/pages/loginPage/login";
import Profile from "./components/pages/profilePage/profile";
import ManageShops from "./components/pages/manageShopsPage/ManageShops";
import SellsArchive from "./components/pages/sellsArchivePage/sellsArchive";
import Categories from "./components/pages/categoriesPage/categories";
import Brands from "./components/pages/brandsPage/brands";
import PendingSells from "./components/pages/pendingSellsPage/pendingSells";
import Home from "./components/pages/homePage/home";
import { ManagerAccountInfo } from "./store/managerAccountInfo";
import { getUserDetails } from "./api/managers";
import ManageItems from "./components/pages/manageItemsPage/manageItems";

function App() {
  const history = useHistory();

  const { accountInfo , setAccountInfo} = ManagerAccountInfo();

  if (sessionStorage.getItem("loggedIn") === null) {
    history.replace("/signIn");
  }
  else if(sessionStorage.getItem("loggedIn") !== null && accountInfo.username === null){
    let output = getUserDetails(sessionStorage.getItem("username"));
    output.then(res => {

      setAccountInfo({
        username: res[0].username,
        password: res[0].password,
        shopId: res[0].shopId,
      });
    })
  }

  return (
    <Switch>
      {sessionStorage.getItem("loggedIn") ? (
        <MainLayout>
          {accountInfo.shopId !== null ? (
            <>
              <Route path="/profile" exact={true} component={Profile} />
              <Route
                path="/manageItems"
                exact={true}
                component={ManageItems}
              />
              <Route
                path="/sellsArchive"
                exact={true}
                component={SellsArchive}
              />
              <Route
                path="/pendingSells"
                exact={true}
                component={PendingSells}
              />
              <Route path="/brands" exact={true} component={Brands} />
              <Route path="/categories" exact={true} component={Categories} />
              <Route path="/home" exact={true} component={Home} />
              <Redirect from="/" to="/home" />
            </>
          ) : (
            <>
              <Route path="/manageShops" exact={true} component={ManageShops} />
              <Route path="/home" exact={true} component={Home} />
              <Redirect from="/" to="/home" />
            </>
          )}
        </MainLayout>
      ) : (
        <Route path="/signIn">
          <Login />
        </Route>
      )}
    </Switch>
  );
}

export default App;
