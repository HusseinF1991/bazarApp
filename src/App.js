import { Redirect } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import MainLayout from "./components/layout/mainLayout";
import Login from "./components/pages/loginPage/login";
import Profile from "./components/pages/profilePage/profile";
import ManageShops from "./components/pages/manageShopsPage/ManageShops";
import SellsArchive from "./components/pages/sellsArchivePage/sellsArchive";
import Categories from "./components/pages/categoriesPage/categories";
import Brands from "./components/pages/brandsPage/brands";
import PurchasesRequests from "./components/pages/purchasesRequestsPage/purchasesRequests";
import Home from "./components/pages/homePage/home";
import { ManagerAccountInfo } from "./store/managerAccountInfo";
import { SocketObject } from "./store/socketObject";
import { getUserDetails, setManagerToken } from "./api/managers";
import ManageItems from "./components/pages/manageItemsPage/manageItems";
import Unknown404 from "./components/pages/404Page/unknown404";
import { resources } from "./resource";
import ErrorInFetch from "./components/layout/errorInFetch";
import { useEffect, useState } from "react";
import { Spin } from "antd";
// import { deleteMyToken, getMyToken, onMessageListener } from "./firebaseInit";
import { url } from "./api/baseUrl";
import { io } from "socket.io-client";

function App() {
  const { accountInfo, setAccountInfo } = ManagerAccountInfo();
  const { setSocketObj } = SocketObject();
  const [waitForFetching, setWaitForFetching] = useState(true);
  const socket = io(url);

  useEffect(() => {
    if (
      sessionStorage.getItem(resources.SESSION_STORAGE.TOKEN) !== null &&
      accountInfo.username === null
    ) {
      let myReqHeader = sessionStorage.getItem(resources.SESSION_STORAGE.TOKEN);
      let output = getUserDetails(myReqHeader);
      output.then((res) => {
        if (res === resources.FAILED_TO_FETCH) {
          ErrorInFetch();
        } else {
          if (
            res.ERROR === resources.ERRORS.USER_NOT_AUTHORIZED.ERROR &&
            res.ERROR_TYPE === resources.ERRORS.USER_NOT_AUTHORIZED.ERROR_TYPE
          ) {
            sessionStorage.clear();
          } else {
            setAccountInfo({
              managerId: res[0].id,
              username: res[0].username,
              password: res[0].password,
              shopId: res[0].shopId,
              shopLogo: res[0].Shop !== null ? res[0].Shop.logo : null,
              shopName: res[0].Shop !== null ? res[0].Shop.name : null,
              token: res[0].token,
            });
          }
        }
        setWaitForFetching(false);
      });
    } else {
      setWaitForFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitForFetching]);

  if (accountInfo.username !== null && accountInfo.shopId !== null) {
    // onMessageListener().then((payload) => {
    //   console.log(payload);
    // });
    // let tokenPromise = getMyToken();
    // tokenPromise.then((token) => {
    //   console.log(token);
    //   if (token !== null && token !== accountInfo.token) {
    //     let myReqBody = {
    //       username: accountInfo.username,
    //       password: accountInfo.password,
    //       token: token,
    //     };
    //     let output = setManagerToken(JSON.stringify(myReqBody));
    //     output.then((res) => {
    //       console.log(res);
    //       setAccountInfo({
    //         managerId: accountInfo.managerId,
    //         username: accountInfo.username,
    //         password: accountInfo.password,
    //         shopId: accountInfo.shopId,
    //         shopLogo: accountInfo.shopLogo,
    //         shopName: accountInfo.shopName,
    //         token: token,
    //       });
    //     });
    //   } else {
    //     let deletePromise = deleteMyToken();
    //     deletePromise.then((res) => {
    //       console.log(res);
    //     });
    //   }
    // });
  }

  //connect to socket server
  useEffect(() => {
    if (accountInfo.username !== null && accountInfo.shopId !== null) {
      if (!socket.connected)
        socket.on(resources.CHAT.SOCKET_MESSAGE.CONNECT, () => {
          // ...
          // console.log(socket.connected);
          setSocketObj(socket);
        });

      // setSocketObj(socket);
    } else {
      socket.disconnect();
      setSocketObj(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountInfo.shopId, accountInfo.username]);

  const AdminSwitch = (
    <MainLayout>
      <Switch>
        <Route
          path={resources.ROUTES.MANAGE_SHOPS}
          exact={true}
          component={ManageShops}
        />
        <Route path={resources.ROUTES.BRANDS} exact={true} component={Brands} />
        <Route
          path={resources.ROUTES.CATEGORIES}
          exact={true}
          component={Categories}
        />
        <Route path={resources.ROUTES.HOME} exact={true} component={Home} />
        <Route path="/" exact={true} component={Home} />
        <Route
          path={resources.ROUTES.Unknown404}
          exact={true}
          component={Unknown404}
        />
        <Redirect from="/" to={resources.ROUTES.Unknown404} />
      </Switch>
    </MainLayout>
  );

  const ShopManagerSwitch = (
    <MainLayout>
      <Switch>
        <Route
          path={resources.ROUTES.PROFILE}
          exact={true}
          component={Profile}
        />
        <Route
          path={resources.ROUTES.MANAGE_ITEMS}
          exact={true}
          component={ManageItems}
        />
        <Route
          path={resources.ROUTES.SELLS_ARCHIVE}
          exact={true}
          component={SellsArchive}
        />
        <Route
          path={resources.ROUTES.PURCHASES_REQUESTS}
          exact={true}
          component={PurchasesRequests}
        />
        <Route path={resources.ROUTES.HOME} exact={true} component={Home} />
        <Route path="/" exact={true} component={Home} />
        <Route
          path={resources.ROUTES.Unknown404}
          exact={true}
          component={Unknown404}
        />
        <Redirect from="/" to={resources.ROUTES.Unknown404} />
      </Switch>
    </MainLayout>
  );

  const NotLoggedInSwitch = (
    <Switch>
      <Route path={resources.ROUTES.SIGN_IN} exact={true} component={Login} />
      <Route path="/" exact={true} component={Login} />
      <Route
        path={resources.ROUTES.Unknown404}
        exact={true}
        component={Unknown404}
      />
      <Redirect from="/" to={resources.ROUTES.Unknown404} />
    </Switch>
  );

  if (waitForFetching) {
    return (
      <div>
        <Spin spinning={true}>
          {/* <Alert
            message="Alert message title"
            description="Further details about the context of this alert."
            type="info"
          /> */}
        </Spin>
      </div>
    );
  }

  return (
    <>
      {accountInfo.username !== null &&
        accountInfo.shopId !== null &&
        ShopManagerSwitch}
      {accountInfo.username !== null &&
        accountInfo.shopId === null &&
        AdminSwitch}
      {accountInfo.username === null && NotLoggedInSwitch}
    </>
  );
}

export default App;
