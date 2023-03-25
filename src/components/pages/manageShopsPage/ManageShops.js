import {
  Table,
  Space,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Typography,
} from "antd";
import {
  DownOutlined,
  DeleteTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { getAllShops } from "../../../api/shops";
import { useEffect } from "react";
import AddShop from "./addShop";
import AddManagerUser from "./addManagerUser";
import { deleteManagerUser } from "../../../api/managers";
import EditShopInfo from "./editShopInfo";
import { shopImgUrl } from "../../../api/baseUrl";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";
import { MainMenuSelection } from "../../../store/mainMenuSelection";

const { confirm } = Modal;

let clickedshop;
function ManageShops() {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [tblHasData, setTblHasData] = useState(false);
  const [data, setData] = useState([]);
  const [showAddNewShop, setShowAddNewShop] = useState(false);
  const [showAddNewManager, setShowAddNewManager] = useState(false);
  const [displayEditShopInfo, setDisplayEditShopInfo] = useState(false);
  const { setSelectedItemInfo } = MainMenuSelection();

  //useEffect for setting selected main menu item
  useEffect(() => {
    setSelectedItemInfo({
      key: resources.MAIN_MENU_ITEMS.MANAGE_SHOPS.KEY,
      title: resources.MAIN_MENU_ITEMS.MANAGE_SHOPS.TITLE,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let output = getAllShops();
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => setTblHasData(!tblHasData));
      } else {
        if (res.length > 0) {
          let data = [];
          res.forEach((element) => {
            let dateNum = Date.parse(element.createdAt);
            let myDate = new Date(dateNum);
            element.createdAt = myDate.toDateString();
            element = {
              key: res.indexOf(element) + 1,
              ...element,
            };
            data.push(element);
          });
          setData(data);
          setTblHasData(true);
        } else {
          setTblHasData(false);
        }
      }
    });
  }, [tblHasData]);

  const columns = [
    { title: "اسم المحل", dataIndex: "name", key: "name" },
    { title: "الايميل", dataIndex: "email", key: "email" },
    { title: "رقم الهاتف", dataIndex: "mobile", key: "mobile" },
    { title: "الموقع", dataIndex: "location", key: "location" },
    { title: "التخصص", dataIndex: "specialty", key: "specialty" },
    { title: "تاريخ الانشاء", dataIndex: "createdAt", key: "createdAt" },
    { title: "نسبة الربح", dataIndex: "profitRate", key: "profitRate" },
    {
      title: "الصورة",
      dataIndex: "logo",
      key: "logo",
      render: (_, record) => (
        <img
          src={`${shopImgUrl}${record.logo}`}
          alt="avatar"
          style={{ width: "50px" }}
        />
      ),
    },
    {
      title: "العمليات",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <Space size="middle">
          <Dropdown overlay={() => menu(record)}>
            <Typography.Link>
              المزيد <DownOutlined />
            </Typography.Link>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const menu = (record) => {
    clickedshop = record;
    return (
      <Menu>
        <Menu.Item
          key={1}
          onClick={() => {
            onDeleteShopClickHandler();
          }}
        >
          حذف
        </Menu.Item>
        <Menu.Item
          key={2}
          onClick={() => {
            onEditShopInfoClickHandler();
          }}
        >
          تعديل
        </Menu.Item>
      </Menu>
    );
  };

  const footer = () => (
    <Button
      type="primary"
      size="default"
      ghost={true}
      onClick={ShowAddNewShopHandler}
    >
      {" "}
      اضافة محل جديد{" "}
    </Button>
  );

  function onEditShopInfoClickHandler() {
    setDisplayEditShopInfo(!displayEditShopInfo);
  }

  function onDeleteShopClickHandler() {
    confirm({
      title: "هل انت متاكد من حذف المحل؟",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: "نعم",
      okType: "danger",
      cancelText: "كلا",
      onOk() {
        message.error("الخيار غير مفعل حاليا");
        // const key = "updatable";
        // message.loading({ content: "جاري الحذف", key });
        // let output = deleteOneItemType(typeRecord.id);
        // output.then((res) => {
        // if (res === resources.FAILED_TO_FETCH) {

        //   ErrorInFetch();
        // } else {
        //   if (res.deleted !== undefined) {
        //     setLoadItems(true);
        //     setTimeout(() => {
        //       message.success({ content: "تم الحذف", key, duration: 1 });
        //     }, 1000);
        //   } else {
        //     message.error("حدث خطأ في عملية الحذف");
        //   }
        // }
        // });
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  }

  const usersTblFooter = () => (
    <Button
      type="primary"
      size="default"
      ghost={true}
      onClick={ShowAddNewManagerHandler}
    >
      {" "}
      اضافة مستخدم جديد{" "}
    </Button>
  );

  function ShowAddNewShopHandler() {
    setShowAddNewShop(!showAddNewShop);
  }

  function ShowAddNewManagerHandler() {
    setShowAddNewManager(!showAddNewManager);
  }

  function showDeleteManagerConfirm(record) {
    confirm({
      title: "هل انت متاكد من حذف هذا الحساب",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: "نعم",
      okType: "danger",
      cancelText: "كلا",
      onOk() {
        const myReqBody = { username: record.username };
        onDeleteManagerClickHandler(myReqBody);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  function onDeleteManagerClickHandler(myReqBody) {
    const key = "updatable";
    message.loading({ content: "جاري الحذف", key });
    let output = deleteManagerUser(JSON.stringify(myReqBody));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onDeleteManagerClickHandler(myReqBody));
      } else {
        if (res.deleted !== undefined) {
          setTblHasData(false);
          setTimeout(() => {
            message.success({ content: "تم الحذف", key, duration: 1 });
          }, 1000);
        } else {
          message.error("حدث خطأ في عملية الحذف");
        }
      }
    });
  }

  //take only the last expanded row and set it in useState => other rows will be shrinked
  function onTableRowExpand(expanded, record) {
    const keys = [];
    if (expanded) {
      keys.push(record.id); // I have set my record.id as row key. Check the documentation for more details.
    }

    setExpandedRowKeys(keys);
  }

  const expandedRowRender = (record) => {
    const columns = [
      { title: "اسم المستخدم", dataIndex: "username", key: "username" },
      { title: "الرمز السري", dataIndex: "password", key: "password" },
      { title: "تاريخ التسجيل", dataIndex: "createdAt", key: "createdAt" },
      {
        title: "العمليات",
        dataIndex: "operation",
        key: "operation",
        render: (text, record, index) => (
          <Space size="middle">
            <DeleteTwoTone onClick={() => showDeleteManagerConfirm(record)} />
          </Space>
        ),
      },
    ];

    const shopUsers = [];
    record.Managers.forEach((shop) => {
      let dateNum = Date.parse(shop.createdAt);
      let myDate = new Date(dateNum);
      shopUsers.push({
        key: record.Managers.indexOf(shop) + 1,
        username: shop.username,
        password: shop.password,
        createdAt: myDate.toLocaleString("en-US"),
      });
    });

    return (
      <Table
        columns={columns}
        dataSource={shopUsers}
        pagination={false}
        footer={usersTblFooter}
      />
    );
  };

  return (
    <>
      <Table
        columns={columns}
        expandable={{
          expandedRowRender: expandedRowRender,
          // rowExpandable: (record) => record.name !== "Not Expandable",
        }}
        dataSource={data}
        footer={footer}
        expandedRowKeys={expandedRowKeys}
        onExpand={onTableRowExpand}
      />
      {showAddNewShop ? (
        <AddShop
          ShowAddNewShopHandler={ShowAddNewShopHandler}
          tblHasData={tblHasData}
          setTblHasData={setTblHasData}
        />
      ) : null}
      {showAddNewManager ? (
        <AddManagerUser
          ShowAddNewManagerHandler={ShowAddNewManagerHandler}
          tblHasData={tblHasData}
          setTblHasData={setTblHasData}
          shopId={expandedRowKeys[0]}
        />
      ) : null}
      {displayEditShopInfo ? (
        <EditShopInfo
          onEditShopInfoClickHandler={onEditShopInfoClickHandler}
          tblHasData={tblHasData}
          setTblHasData={setTblHasData}
          shopData={clickedshop}
        />
      ) : null}
    </>
  );
}

export default ManageShops;
