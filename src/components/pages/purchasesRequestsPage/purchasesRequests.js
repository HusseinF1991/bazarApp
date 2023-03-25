import {
  Table,
  Tag,
  Space,
  Dropdown,
  Button,
  Menu,
  Input,
  Typography,
} from "antd";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect, useState } from "react";
import { ManagerAccountInfo } from "../../../store/managerAccountInfo";
import { getPurchasesRequests } from "../../../api/invoices";
import PurchaseReqDetails from "./purchaseReqDetails";
import InvoiceChat from "./invoiceChat";
import ErrorInFetch from "../../layout/errorInFetch";
import { resources } from "../../../resource";
import { MainMenuSelection } from "../../../store/mainMenuSelection";

let searchInput;
let selectedInvoiceId;
let selectedInvoiceChat = {
  customerName: "",
  invoiceShopId: "",
};
function PurchasesRequests() {
  const { accountInfo } = ManagerAccountInfo();
  const [displayInvoiceChat, setDisplayInvoiceChat] = useState(false);
  const [mySearchState, setMySearchState] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const [purchasesReqs, setPurchasesReqs] = useState([]);
  const [loadPurchasesReqs, setLoadPurchasesReqs] = useState(true);
  const [displayPurchaseReqDetails, setDisplayPurchaseReqDetails] =
    useState(false);
  const { setSelectedItemInfo } = MainMenuSelection();

  //useEffect for setting selected main menu item
  useEffect(() => {
    setSelectedItemInfo({
      key: resources.MAIN_MENU_ITEMS.PURCHASES_REQUESTS.KEY,
      title: resources.MAIN_MENU_ITEMS.PURCHASES_REQUESTS.TITLE,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const myReqBody = {
      pageNum: 1,
      shopId: accountInfo.shopId,
    };
    let output = getPurchasesRequests(JSON.stringify(myReqBody));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => setLoadPurchasesReqs(!loadPurchasesReqs));
      } else {
        let data = [];
        res.docs.forEach((element) => {
          const createdAtDNum = Date.parse(element.InvoiceShops[0].createdAt);
          const createdAtD = new Date(createdAtDNum);
          const newElement = {
            ...element,
            key: res.docs.indexOf(element) + 1,
            customerName: element.Customer.name,
            totalCost: element.InvoiceShops[0].totalCost,
            paidAmount: element.InvoiceShops[0].paidAmount,
            createdAt: createdAtD.toLocaleString("en-US"),
            paymentMethod: element.InvoiceShops[0].paymentMethod,
            status: element.InvoiceShops[0].status,
          };
          data.push(newElement);
        });
        setPurchasesReqs(data);
        setLoadPurchasesReqs(false);
      }
    });
  }, [accountInfo.shopId, loadPurchasesReqs]);

  const getColumnSearchProps = (colTitle, dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`بحث ${colTitle}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setMySearchState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            تطبيق
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            تفريغ
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            ghost={true}
            size="small"
            style={{ width: 90 }}
          >
            بحث
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) => (
      <Space>
        <Typography.Link onClick={() => console.log(text)}>
          {mySearchState.searchedColumn === dataIndex ? (
            <Highlighter
              highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
              searchWords={[mySearchState.searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            text
          )}
        </Typography.Link>
      </Space>
    ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setMySearchState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setMySearchState({ searchText: "" });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: "5%",
      align: "center",
    },
    {
      title: "رقم الوصل",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "10%",
    },
    {
      title: "اسم الزبون",
      dataIndex: "customerName",
      key: "customerName",
      align: "center",
      ...getColumnSearchProps("اسم الزبون", "customerName"),
    },
    {
      title: "المبلغ الكلي",
      dataIndex: "totalCost",
      key: "totalCost",
      align: "center",
    },
    {
      title: "المبلغ المدفوع",
      dataIndex: "paidAmount",
      key: "paidAmount",
      align: "center",
    },
    {
      title: "طريقة الدفع",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      align: "center",
    },
    {
      title: "تاريخ الطلب",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
    },
    {
      title: "الحالة",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: [
        {
          text: "قيد الانتظار",
          value: "pending",
        },
        {
          text: "الموافق عليه",
          value: "approved",
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, record) => {
        return (
          <Space>
            {record.status === "pending" ? (
              <Tag color={"red"}>{`قيد الانتظار`}</Tag>
            ) : (
              <Tag color={"green"}>{`تم الموافقة عليه`}</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: "العمليات",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <Space size="middle">
          {/* <a>رفض الطلب</a>
          <a>الموافقة على الطلب</a>
          <a>الغاء الطلب</a>
          <a>مراسلة المشتري</a> */}
          <Dropdown overlay={() => requestsOpMenu(record)}>
            <Button type="link" size="default">
              عرض <DownOutlined />
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const requestsOpMenu = (requestRecord) => (
    <Menu
      onClick={(event) => onRequestsOpMenuClickHandler(requestRecord, event)}
    >
      <Menu.Item key={1}>مراسلة المشتري</Menu.Item>
      <Menu.Item key={2}>عرض التفاصيل كاملة</Menu.Item>
    </Menu>
  );

  function onRequestsOpMenuClickHandler(requestRecord, event) {
    selectedInvoiceChat = {
      customerName: requestRecord.customerName,
      invoiceShopId: requestRecord.InvoiceShops[0].id,
    };
    selectedInvoiceId = requestRecord.id;
    switch (event.key) {
      case "1": //
        OnOpenInvoiceChatClickHandler();
        break;
      case "2": //
        OnOpenPurchaseReqClickHandler();
        break;
      default:
        break;
    }
  }

  function onChangePageHandler(page, pageSize) {
    const myReqBody = {
      pageNum: page,
      shopId: accountInfo.shopId,
    };
    let output = getPurchasesRequests(JSON.stringify(myReqBody));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onChangePageHandler(page, pageSize));
      } else {
        let data = [];
        res.docs.forEach((element) => {
          const createdAtDNum = Date.parse(element.InvoiceShops[0].createdAt);
          const createdAtD = new Date(createdAtDNum);
          const newElement = {
            ...element,
            key: res.docs.indexOf(element) + 1,
            customerName: element.Customer.name,
            totalCost: element.InvoiceShops[0].totalCost,
            paidAmount: element.InvoiceShops[0].paidAmount,
            createdAt: createdAtD.toLocaleString("en-US"),
            paymentMethod: element.InvoiceShops[0].paymentMethod,
            status: element.InvoiceShops[0].status,
          };
          data.push(newElement);
        });
        setPurchasesReqs(data);
      }
    });
  }

  function OnOpenPurchaseReqClickHandler() {
    setDisplayPurchaseReqDetails(!displayPurchaseReqDetails);
  }

  function OnOpenInvoiceChatClickHandler() {
    setDisplayInvoiceChat(!displayInvoiceChat);
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={purchasesReqs}
        size={"small"}
        bordered
        pagination={{
          onChange: onChangePageHandler,
        }}
        scroll={{ y: 380 }}
      />
      {displayPurchaseReqDetails ? (
        <PurchaseReqDetails
          OnOpenPurchaseReqClickHandler={OnOpenPurchaseReqClickHandler}
          purchasesReqs={purchasesReqs}
          selectedInvoiceId={selectedInvoiceId}
          setLoadPurchasesReqs={setLoadPurchasesReqs}
        />
      ) : null}
      {displayInvoiceChat ? (
        <InvoiceChat
          OnOpenInvoiceChatClickHandler={OnOpenInvoiceChatClickHandler}
          customerName={selectedInvoiceChat.customerName}
          invoiceShopId={selectedInvoiceChat.invoiceShopId}
        />
      ) : null}
    </>
  );
}

export default PurchasesRequests;
