import {
  Layout,
  Menu,
  Breadcrumb,
  notification,
  Badge,
  Drawer,
  List,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  SnippetsOutlined,
  LogoutOutlined,
  TeamOutlined,
  CloseOutlined,
  BellFilled,
  CommentOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  MdOutlineProductionQuantityLimits,
  MdOutlineCategory,
  MdOutlineRateReview,
} from "react-icons/md";
import { BiCog } from "react-icons/bi";
import { SiBrandfolder } from "react-icons/si";
import "./mainLayout.css";
import { useEffect, useState } from "react";
import { ManagerAccountInfo } from "../../store/managerAccountInfo";
import { Link, useHistory } from "react-router-dom";
import { resources } from "../../resource";
import { MainMenuSelection } from "../../store/mainMenuSelection";
import { SocketObject } from "../../store/socketObject";
import {
  deleteOneNotification,
  getShopNotifications,
} from "../../api/shopNotifications";
import { getOnePurchaseReq } from "../../api/invoices";
import ErrorInFetch from "./errorInFetch";
import PurchaseReqDetails from "../pages/purchasesRequestsPage/purchaseReqDetails";
import ModifyItem from "../pages/manageItemsPage/modifyItem";

function MainLayout(props) {
  const history = useHistory();
  const { accountInfo, setAccountInfo } = ManagerAccountInfo(); //setUsername, setPassword, setShopId } =
  const { Header, Content, Footer, Sider } = Layout;
  const [collapsed, setColapsed] = useState(false);
  const { selectedItemInfo } = MainMenuSelection();
  const { socketObj } = SocketObject();
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [shopNotifications, setShopNotifications] = useState([]);
  const [fetchNotifications, setFetchNotifications] = useState(true);
  const [displayModifyItemModel, setDisplayModifyItemModel] = useState(false);
  const [displayPurchaseReqDetails, setDisplayPurchaseReqDetails] =
    useState(false);
  const [purchasesReqsProps, setPurchasesReqsProps] = useState({
    selectedInvoiceId: "",
    purchasesReqs: [],
  });
  const [modifyItemsProps, setModifyItemsProps] = useState({
    selectedItemId: "",
  });

  function onCollapse() {
    setColapsed(!collapsed);
  }

  useEffect(() => {
    if (
      accountInfo.username !== null &&
      accountInfo.shopId !== null &&
      socketObj !== null
    ) {
      socketObj.on(
        resources.CHAT.SOCKET_MESSAGE.RECEIVE_MESSAGE_BY_MANAGER,
        (data) => {
          if (data.shopId === accountInfo.shopId) {
            // console.log(data);
            openNotification({
              message: `رسالة جديدة من ${data.senderName}`,
              description: data.msgBody,
            });

            setFetchNotifications(true);
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketObj]);

  useEffect(() => {
    function getData() {
      if (accountInfo.shopId !== null) {
        let output = getShopNotifications(accountInfo.shopId);
        output.then((res) => {
          if (res === resources.FAILED_TO_FETCH) {
            ErrorInFetch(() => getData());
          } else {
            setShopNotifications(res);
            setFetchNotifications(false);
          }
        });
      }
    }
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNotifications]);

  const openNotification = (content) => {
    const args = {
      message: content.message,
      description: content.description,
      duration: 5,
    };
    notification.open(args);
  };

  function OnDeleteNotification(id, display_ErrorInFetch) {
    let output = deleteOneNotification(id);
    output.then((result) => {
      if (result === resources.FAILED_TO_FETCH) {
        if (display_ErrorInFetch)
          ErrorInFetch(() => OnDeleteNotification(id, display_ErrorInFetch));
      } else {
        setFetchNotifications(true);
      }
    });
  }

  function OnNotificationClicked(item) {
    if (item.opTitle === resources.SHOP_NOTIFICATION.NEW_REVIEW.OP_TITLE) {
      setModifyItemsProps({ selectedItemId: item.opColContent });
      setShowNotificationDrawer(false);
      OnDeleteNotification(item.id, false); //delete selected notification from db
      OnModifyItemClickHandler();
    } else {
      let output = getOnePurchaseReq(item.opColContent);
      output.then(async (result) => {
        if (result === resources.FAILED_TO_FETCH) {
          ErrorInFetch(() => OnNotificationClicked(item));
        } else {
          let data = [];

          const createdAtDNum = Date.parse(result[0].InvoiceShops[0].createdAt);
          const createdAtD = new Date(createdAtDNum);
          const newElement = {
            ...result[0],
            key: 1,
            customerName: result[0].Customer.name,
            totalCost: result[0].InvoiceShops[0].totalCost,
            paidAmount: result[0].InvoiceShops[0].paidAmount,
            createdAt: createdAtD.toLocaleString("en-US"),
            paymentMethod: result[0].InvoiceShops[0].paymentMethod,
            status: result[0].InvoiceShops[0].status,
          };
          data.push(newElement);
          await setPurchasesReqsProps({
            purchasesReqs: data,
            selectedInvoiceId: data[0].id,
          });
          setShowNotificationDrawer(false);
          OnDeleteNotification(item.id, false); //delete selected notification from db
          OnOpenPurchaseReqClickHandler();
        }
      });
    }
  }

  async function onClickedSider(event) {
    if (event.key === "7") {
      await sessionStorage.clear();
      await setAccountInfo({
        managerId: null,
        username: null,
        password: null,
        shopId: null,
        shopLogo: null,
        shopName: null,
        token: null,
      });

      history.push(resources.ROUTES.SIGN_IN);
    } else {
      sessionStorage.setItem(
        resources.SESSION_STORAGE.mainMenuSelectedKey,
        event.key
      );
      sessionStorage.setItem(
        resources.SESSION_STORAGE.mainMenuSelectedTitle,
        event.item.props.title
      );
    }
  }

  function OnModifyItemClickHandler() {
    if (
      displayModifyItemModel === true &&
      history.location.pathname === resources.ROUTES.MANAGE_ITEMS
    ) {
      setDisplayModifyItemModel(!displayModifyItemModel);
      window.location.reload();
    } else {
      setDisplayModifyItemModel(!displayModifyItemModel);
    }
  }

  function OnOpenPurchaseReqClickHandler() {
    if (
      displayPurchaseReqDetails === true &&
      history.location.pathname === resources.ROUTES.PURCHASES_REQUESTS
    ) {
      setDisplayPurchaseReqDetails(!displayPurchaseReqDetails);
      window.location.reload();
    } else {
      setDisplayPurchaseReqDetails(!displayPurchaseReqDetails);
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          onSelect={onClickedSider}
          selectedKeys={selectedItemInfo.key}
        >
          {accountInfo.shopId !== null ? (
            <>
              <Menu.Item
                key={resources.MAIN_MENU_ITEMS.PROFILE.KEY}
                title={resources.MAIN_MENU_ITEMS.PROFILE.TITLE}
                icon={<UserOutlined />}
              >
                <Link to={resources.ROUTES.PROFILE}>
                  {resources.MAIN_MENU_ITEMS.PROFILE.TITLE}
                </Link>
              </Menu.Item>
              <Menu.Item
                key={resources.MAIN_MENU_ITEMS.MANAGE_ITEMS.KEY}
                title={resources.MAIN_MENU_ITEMS.MANAGE_ITEMS.TITLE}
                icon={<BiCog />}
              >
                <Link to={resources.ROUTES.MANAGE_ITEMS}>
                  {resources.MAIN_MENU_ITEMS.MANAGE_ITEMS.TITLE}
                </Link>
              </Menu.Item>
              <Menu.Item
                key={resources.MAIN_MENU_ITEMS.PURCHASES_REQUESTS.KEY}
                title={resources.MAIN_MENU_ITEMS.PURCHASES_REQUESTS.TITLE}
                icon={<MdOutlineProductionQuantityLimits />}
              >
                <Link to={resources.ROUTES.PURCHASES_REQUESTS}>
                  {resources.MAIN_MENU_ITEMS.PURCHASES_REQUESTS.TITLE}
                </Link>
              </Menu.Item>
              <Menu.Item
                key={resources.MAIN_MENU_ITEMS.SELLS_ARCHIVE.KEY}
                title={resources.MAIN_MENU_ITEMS.SELLS_ARCHIVE.TITLE}
                icon={<SnippetsOutlined />}
              >
                <Link to={resources.ROUTES.SELLS_ARCHIVE}>
                  {resources.MAIN_MENU_ITEMS.SELLS_ARCHIVE.TITLE}
                </Link>
              </Menu.Item>
              <Menu.Item
                key={resources.MAIN_MENU_ITEMS.SIGN_OUT.KEY}
                title={resources.MAIN_MENU_ITEMS.SIGN_OUT.TITLE}
                icon={<LogoutOutlined />}
              >
                {resources.MAIN_MENU_ITEMS.SIGN_OUT.TITLE}
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item
                key={resources.MAIN_MENU_ITEMS.MANAGE_SHOPS.KEY}
                title={resources.MAIN_MENU_ITEMS.MANAGE_SHOPS.TITLE}
                icon={<TeamOutlined />}
              >
                <Link to={resources.ROUTES.MANAGE_SHOPS}>
                  {resources.MAIN_MENU_ITEMS.MANAGE_SHOPS.TITLE}
                </Link>
              </Menu.Item>
              <Menu.Item
                key={resources.MAIN_MENU_ITEMS.BRANDS.KEY}
                title={resources.MAIN_MENU_ITEMS.BRANDS.TITLE}
                icon={<SiBrandfolder />}
              >
                <Link to={resources.ROUTES.BRANDS}>
                  {resources.MAIN_MENU_ITEMS.BRANDS.TITLE}
                </Link>
              </Menu.Item>
              <Menu.Item
                key={resources.MAIN_MENU_ITEMS.CATEGORIES.KEY}
                title={resources.MAIN_MENU_ITEMS.CATEGORIES.TITLE}
                icon={<MdOutlineCategory />}
              >
                <Link to={resources.ROUTES.CATEGORIES}>
                  {resources.MAIN_MENU_ITEMS.CATEGORIES.TITLE}
                </Link>
              </Menu.Item>
              <Menu.Item
                key={resources.MAIN_MENU_ITEMS.SIGN_OUT.KEY}
                title={resources.MAIN_MENU_ITEMS.SIGN_OUT.TITLE}
                icon={<LogoutOutlined />}
              >
                {resources.MAIN_MENU_ITEMS.SIGN_OUT.TITLE}
              </Menu.Item>
            </>
          )}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: 0, textAlign: "left" }}
        >
          {accountInfo.shopId !== null && (
            <Badge count={shopNotifications.length}>
              <BellFilled
                style={{ fontSize: "25px" }}
                className="ml-4"
                onClick={() => setShowNotificationDrawer(true)}
              />
            </Badge>
          )}
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>{accountInfo.username}</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedItemInfo.title}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{
              padding: 24,
              paddingBottom: 0,
              minHeight: 360,
              height: "510px",
              overflowY: "auto",
            }}
          >
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center", padding: 0, paddingBottom: 10 }}>
          Bazar app ©2021 Created by URUKsys
        </Footer>
      </Layout>
      <Drawer
        bodyStyle={{ paddingTop: "0px" }}
        title="الاشعارات"
        placement="right"
        onClose={() => setShowNotificationDrawer(false)}
        visible={showNotificationDrawer}
        closable={false}
      >
        <List
          dataSource={shopNotifications}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <div>
                  <Tooltip title="حذف الاشعار">
                    <CloseOutlined
                      onClick={() => OnDeleteNotification(item.id, true)}
                    />
                  </Tooltip>
                </div>,
              ]}
            >
              <Tooltip title="عرض التفاصيل">
                <div
                  className="flex cursor-pointer"
                  onClick={() => OnNotificationClicked(item)}
                >
                  <div className="flex items-center">
                    {item.opTitle ===
                      resources.SHOP_NOTIFICATION.NEW_REVIEW.OP_TITLE && (
                      <MdOutlineRateReview />
                    )}
                    {item.opTitle ===
                      resources.SHOP_NOTIFICATION.NEW_REQUEST.OP_TITLE && (
                      <ShoppingCartOutlined />
                    )}
                    {item.opTitle ===
                      resources.SHOP_NOTIFICATION.NEW_CHAT_MESSAGE.OP_TITLE && (
                      <CommentOutlined />
                    )}
                  </div>
                  <div className="mr-2">{item.opDescription}</div>
                </div>
              </Tooltip>
            </List.Item>
          )}
        ></List>
      </Drawer>
      {displayPurchaseReqDetails ? (
        <PurchaseReqDetails
          OnOpenPurchaseReqClickHandler={OnOpenPurchaseReqClickHandler}
          purchasesReqs={purchasesReqsProps.purchasesReqs}
          selectedInvoiceId={purchasesReqsProps.selectedInvoiceId}
          // setLoadPurchasesReqs={setLoadPurchasesReqs}
        />
      ) : null}
      {displayModifyItemModel ? (
        <ModifyItem
          OnModifyItemClickHandler={OnModifyItemClickHandler}
          selectedItemId={modifyItemsProps.selectedItemId}
          // setLoadItems={setLoadItems}
        />
      ) : null}
    </Layout>
  );
}

export default MainLayout;
