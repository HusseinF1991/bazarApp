import { Table, Space, Button, Dropdown, Menu, Modal, message } from "antd";
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

const { confirm } = Modal;

const columns = [
  { title: "اسم المحل", dataIndex: "name", key: "name" },
  { title: "الايميل", dataIndex: "email", key: "email" },
  { title: "الموقع", dataIndex: "location", key: "location" },
  { title: "التخصص", dataIndex: "specialty", key: "specialty" },
  { title: "تاريخ الانشاء", dataIndex: "createdAt", key: "createdAt" },
  { title: "نسبة الربح", dataIndex: "profitRate", key: "profitRate" },
  {
    title: "الصورة",
    dataIndex: "logo",
    key: "logo",
    render: (dataIndex) => (
      <img
        src={`data:image/${dataIndex.imageExt};base64,${dataIndex.image}`}
        alt="avatar"
        style={{ width: "50px" }}
      />
    ),
  },
  {
    title: "العمليات",
    dataIndex: "",
    key: "x",
    render: () => (
      <Space size="middle">
        <Dropdown overlay={menu}>
          <a>
            المزيد <DownOutlined />
          </a>
        </Dropdown>
      </Space>
    ),
  },
];

const menu = (
  <Menu>
    <Menu.Item>حذف</Menu.Item>
    <Menu.Item>تعديل</Menu.Item>
  </Menu>
);

function ManageShops() {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [tblHasData, setTblHasData] = useState(false);
  const [data, setData] = useState([]);
  const [showAddNewShop, setShowAddNewShop] = useState(false);
  const [showAddNewManager, setShowAddNewManager] = useState(false);
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

  useEffect(() => {
    let output = getAllShops();
    output.then((res) => {
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
        setTblHasData(true);
        setData(data);
      } else {
        setTblHasData(false);
      }
    });
  }, [tblHasData]);

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
        console.log(record);
        const myReqBody = { username: record.username };
        const key = "updatable";
        message.loading({ content: "جاري الحذف", key });
        let output = deleteManagerUser(JSON.stringify(myReqBody));
        output.then((res) => {
          if(res.deleted !== undefined){

            setTblHasData(false);
            setTimeout(() => {
              message.success({ content: "تم الحذف", key, duration: 1 });
            }, 1000);
          }
          else{
            message.error('حدث خطأ في عملية الحذف');
          }
        });
      },
      onCancel() {
        console.log("Cancel");
      },
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
    </>
  );
}

export default ManageShops;
