import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserOutlined,
  PlusSquareOutlined,
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  BankFilled,
} from "@ant-design/icons";
import "./mainLayout.css";
import { useState } from "react";
import { ManagerAccountInfo } from "../../store/managerAccountInfo";
import { Link, useHistory } from "react-router-dom";

function MainLayout(props) {
  const history = useHistory();
  const { accountInfo, setAccountInfo } = ManagerAccountInfo(); //setUsername, setPassword, setShopId } =
  const { Header, Content, Footer, Sider } = Layout;
  const [collapsed, setColapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState({
    key: null,
    title: null,
  });
  // const { SubMenu } = Menu;

  function onCollapse() {
    setColapsed(!collapsed);
  }

  async function onClickedSider(event) {
    setSelectedMenuItem({ key: event.key, title: event.item.props.title });

    if (event.key === "8") {
      await sessionStorage.clear();
      await setAccountInfo({
        username: null,
        password: null,
        shopId: null,
      });

      history.push("/signIn");
    }
  }

  return (
    <Layout style={{ minHeight: "100vh"}}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu
          theme="dark"
          // defaultSelectedKeys={["1"]}
          mode="inline"
          onSelect={onClickedSider}
        >
          {accountInfo.shopId !== null ? (
            <>
              <Menu.Item key="1" title="Profile" icon={<UserOutlined />}>
                <Link to="/profile">Profile</Link>
              </Menu.Item>
              <Menu.Item
                key="2"
                title="Manage items"
                icon={<PlusSquareOutlined />}
              >
                <Link to="/manageItems">Manage items</Link>
              </Menu.Item>
              <Menu.Item
                key="3"
                title="Pending sells"
                icon={<PieChartOutlined />}
              >
                <Link to="/pendingSells">Pending sells</Link>
              </Menu.Item>
              <Menu.Item
                key="4"
                title="Sells archive"
                icon={<DesktopOutlined />}
              >
                <Link to="/sellsArchive">Sells archive</Link>
              </Menu.Item>
              <Menu.Item key="5" title="Brands" icon={<TeamOutlined />}>
                <Link to="/brands">Brands</Link>
              </Menu.Item>
              <Menu.Item key="6" title="Categories" icon={<BankFilled />}>
                <Link to="/categories">Categories</Link>
              </Menu.Item>
              <Menu.Item key="7" title="Log out" icon={<FileOutlined />}>
                Log out
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="8" title="ManageShops" icon={<BankFilled />}>
                <Link to="/manageShops">Manage shops</Link>
              </Menu.Item>
              <Menu.Item key="7" title="Log out" icon={<FileOutlined />}>
                Log out
              </Menu.Item>
            </>
          )}
          {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu> */}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ padding: 0, textAlign: "center" }}
        ></Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>{selectedMenuItem.title}</Breadcrumb.Item>
            <Breadcrumb.Item>{accountInfo.username}</Breadcrumb.Item>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360, height: "100%"}}
          >
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          venice-store app ©2021 Created by AURORA
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
