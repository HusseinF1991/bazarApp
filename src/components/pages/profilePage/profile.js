import {
  Button,
  Descriptions,
  Image,
  Space,
  Table,
  Modal,
  message,
  Badge,
} from "antd";
import { useEffect, useState } from "react";
import { getOneShopDetails } from "../../../api/shops";
import { ManagerAccountInfo } from "../../../store/managerAccountInfo";
import { DeleteTwoTone, ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteManagerUser } from "../../../api/managers";
import AddManagerUser from "../manageShopsPage/addManagerUser";
import { shopImgUrl } from "../../../api/baseUrl";
import ErrorInFetch from "../../layout/errorInFetch";
import { resources } from "../../../resource";
import { MainMenuSelection } from "../../../store/mainMenuSelection";

const { confirm } = Modal;

function Profile() {
  const { accountInfo } = ManagerAccountInfo();
  const [data, setdata] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [showAddNewManager, setShowAddNewManager] = useState(false);
  const { setSelectedItemInfo } = MainMenuSelection();

  //useEffect for setting selected main menu item
  useEffect(() => {
    setSelectedItemInfo({
      key: resources.MAIN_MENU_ITEMS.PROFILE.KEY,
      title: resources.MAIN_MENU_ITEMS.PROFILE.TITLE,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function ShowAddNewManagerHandler() {
    setShowAddNewManager(!showAddNewManager);
  }

  function showDeleteManagerConfirm(record) {
    if (data.Managers.length > 1) {
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
    } else {
      message.error("يجب ان يبقى حساب واحد على الاقل");
    }
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
          setLoadingData(true);
          setTimeout(() => {
            message.success({ content: "تم الحذف", key, duration: 1 });
          }, 1000);
        } else {
          message.error("حدث خطأ في عملية الحذف");
        }
      }
    });
  }

  const columns = [
    { title: "اسم المستخدم", dataIndex: "username", key: "username" },
    { title: "الرمز السري", dataIndex: "password", key: "password" },
    {
      title: "تاريخ التسجيل",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => {
        let dateNum = Date.parse(text);
        let myDate = new Date(dateNum);
        return <div>{myDate.toDateString()}</div>;
      },
    },
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

  useEffect(() => {
    const myReqBody = {
      shopId: accountInfo.shopId,
    };
    let output = getOneShopDetails(JSON.stringify(myReqBody));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => setLoadingData(!loadingData));
      } else {
        let dateNum = Date.parse(res[0].createdAt);
        let myDate = new Date(dateNum);
        res[0].createdAt = myDate.toDateString();
        let newManngersArr = [];
        res[0].Managers.forEach((element) => {
          let newElement = {
            key: element.id,
            ...element,
          };
          newManngersArr.push(newElement);
        });
        res[0].Managers = newManngersArr;
        setdata(res[0]);
        setLoadingData(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingData]);

  return (
    <Space direction="vertical" className="pb-3">
      <Badge.Ribbon text="معلومات المحل" color="red">
        <Descriptions className="bg-gray-200" bordered title="/" size="default">
          <Descriptions.Item label="الاسم">{data.name}</Descriptions.Item>
          <Descriptions.Item label="التخصص">{data.specialty}</Descriptions.Item>
          <Descriptions.Item label="الموقع">{data.location}</Descriptions.Item>
          <Descriptions.Item label="رقم الهاتف">{data.mobile}</Descriptions.Item>
          <Descriptions.Item label="تاريخ التسجيل">
            {data.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="الايميل">{data.email}</Descriptions.Item>
          <Descriptions.Item label="نسبةالربح">
            {data.profitRate}
          </Descriptions.Item>
          <Descriptions.Item label="صورة المحل">
            <Image
              width={200}
              src={data !== "" ? `${shopImgUrl}${data.logo}` : null}
            />
          </Descriptions.Item>
        </Descriptions>
      </Badge.Ribbon>
      <Badge.Ribbon text="الحسابات" color="red">
        <Table
          columns={columns}
          dataSource={data.Managers !== null ? data.Managers : null}
          pagination={false}
          footer={usersTblFooter}
        />
      </Badge.Ribbon>
      {showAddNewManager ? (
        <AddManagerUser
          ShowAddNewManagerHandler={ShowAddNewManagerHandler}
          tblHasData={loadingData}
          setTblHasData={setLoadingData}
          shopId={accountInfo.shopId}
        />
      ) : null}
    </Space>
  );
}

export default Profile;
