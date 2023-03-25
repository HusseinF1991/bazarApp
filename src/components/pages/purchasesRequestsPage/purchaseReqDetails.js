import {
  Badge,
  Button,
  Descriptions,
  Form,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Popover,
  Radio,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import back_direction from "../../../images/back_direction.png";
import {
  DeleteTwoTone,
  ExclamationCircleOutlined,
  EditTwoTone,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import Text from "antd/lib/typography/Text";
import { UpdateInInvoiceShops } from "../../../api/invoiceShops";
import InvoiceChat from "./invoiceChat";
import CustomerLocOnMap from "./customerLocOnMap";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";

const { confirm } = Modal;

let conFirmChangesReqBody = {
  invoiceShopId: "",
  deleteItemsId: [],
  paidAmount: "",
  totalCost: "",
  oldStatus: "",
  newStatus: "",
  invoiceItemsWithDeleted: [],
  thereIsChanges: false,
};
function PurchaseReqDetails(props) {
  const [selectedRequest, setSelectedRequest] = useState("");
  const [fetchingData, setFetchingData] = useState(true);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [displayCustomerLocOnMap, setDisplayCustomerLocOnMap] = useState(false);
  const [editPaidAmountVisibility, setEditPaidAmountVisibility] = useState({
    visible: false,
  });
  const [displayInvoiceChat, setDisplayInvoiceChat] = useState(false);
  const [editInvoiceStatusVisibility, setEditInvoiceStatusVisibility] =
    useState({
      visible: false,
    });

  useEffect(() => {
    const selectedReq = props.purchasesReqs.filter(
      (element) => element.id === props.selectedInvoiceId
    );

    let InvoiceItemsArr = [];
    selectedReq[0].InvoiceShops[0].InvoiceItems.forEach((element) => {
      let newElement = {
        key: selectedReq[0].InvoiceShops[0].InvoiceItems.indexOf(element) + 1,
        itemCode: element.ItemType.Item.itemCode,
        itemName: element.ItemType.Item.itemName,
        typeName: element.ItemType.typeName,
        availableQty: element.ItemType.availableQty,
        ...element,
      };
      InvoiceItemsArr.push(newElement);
    });

    let selectedRequestObj = {
      customer: selectedReq[0].Customer,
      invoiceItems: [...InvoiceItemsArr],
      InvoiceChats: [...selectedReq[0].InvoiceShops[0].InvoiceChats],
      invoiceId: selectedReq[0].id,
      invoiceShopId: selectedReq[0].InvoiceShops[0].id,
      createdAt: selectedReq[0].createdAt,
      customerId: selectedReq[0].customerId,
      customerName: selectedReq[0].customerName,
      deleteFlag: selectedReq[0].deleteFlag,
      key: selectedReq[0].key,
      paidAmount: selectedReq[0].paidAmount,
      paymentMethod: selectedReq[0].paymentMethod,
      status: selectedReq[0].status,
      totalCost: selectedReq[0].totalCost,
      updatedAt: selectedReq[0].updatedAt,
    };

    conFirmChangesReqBody = {
      invoiceShopId: selectedReq[0].InvoiceShops[0].id,
      deleteItemsId: [],
      paidAmount: selectedReq[0].paidAmount,
      totalCost: selectedReq[0].totalCost,
      oldStatus: selectedReq[0].status,
      newStatus: selectedReq[0].status,
      invoiceItemsWithDeleted: [...InvoiceItemsArr],
      thereIsChanges: false,
    };
    setSelectedRequest(selectedRequestObj);
    setFetchingData(false);
  }, [fetchingData, props.purchasesReqs, props.selectedInvoiceId]);

  //take only the last expanded row and set it in useState => other rows will be shrinked
  function onTableRowExpand(expanded, record) {
    const keys = [];
    if (expanded) {
      keys.push(record.key); // I have set my record.id as row key. Check the documentation for more details.
    }

    setExpandedRowKeys(keys);
  }

  const itemColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: "5%",
      align: "center",
    },
    {
      title: "رمز المادة",
      dataIndex: "itemCode",
      key: "itemCode",
      align: "center",
    },
    {
      title: "اسم المادة",
      dataIndex: "itemName",
      key: "itemName",
      align: "center",
    },
    {
      title: "النوع",
      dataIndex: "typeName",
      key: "typeName",
      align: "center",
    },
    {
      title: "سعر المادة",
      dataIndex: "sellPrice",
      key: "sellPrice",
      align: "center",
    },
    {
      title: "الكمية",
      dataIndex: "qty",
      key: "qty",
      align: "center",
    },
    {
      title: "الكمية المتوفرة",
      dataIndex: "qty",
      key: "qty",
      align: "center",
    },
    {
      title: "العمليات",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => {
        return (
          <Space size="middle">
            {selectedRequest.status === resources.INVOICE_STATUS.PENDING &&
              selectedRequest.invoiceItems.length > 1 && (
                <Tooltip placement="right" title={"حذف"}>
                  <Popconfirm
                    title="هل انت متاكد من الحذف؟"
                    onConfirm={() => OnDeleteItemClickHandler(record)}
                    okText="نعم"
                    cancelText="كلا"
                  >
                    <DeleteTwoTone />
                  </Popconfirm>
                </Tooltip>
              )}
          </Space>
        );
      },
    },
  ];

  function OnDeleteItemClickHandler(record) {
    let subtractedAmount = record.qty * record.sellPrice;
    selectedRequest.totalCost = selectedRequest.totalCost - subtractedAmount;
    selectedRequest.invoiceItems = selectedRequest.invoiceItems.filter(
      (element) => element.key !== record.key
    );

    conFirmChangesReqBody.totalCost = selectedRequest.totalCost;
    conFirmChangesReqBody.thereIsChanges = true;
    conFirmChangesReqBody.deleteItemsId.push(record.id);
    setSelectedRequest({ ...selectedRequest });
    message.warning("سيتم التنفيذ عند الضغط على زر تنفيذ التعديلات");
  }

  const editPaidAmountPopOver = () => {
    function onFinish(event) {
      selectedRequest.paidAmount = event.newValue;
      conFirmChangesReqBody.paidAmount = event.newValue;
      conFirmChangesReqBody.thereIsChanges = true;
      setSelectedRequest({ ...selectedRequest });
      setEditPaidAmountVisibility({ visible: false });
      message.warning("سيتم التنفيذ عند الضغط على زر تنفيذ التعديلات");
    }

    return (
      <Form onFinish={onFinish}>
        <Form.Item label="الحالي" className="m-0">
          <Text>{selectedRequest.paidAmount}</Text>
        </Form.Item>
        <Form.Item
          name={["newValue"]}
          label="الجديد"
          required={true}
          rules={[
            {
              validator: (_, value) =>
                value !== undefined && value <= selectedRequest.totalCost
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "المبلغ يجب ان يكون اقل او يساوي مجموع الفاتورة"
                      )
                    ),
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item className="m-0">
          <Button htmlType="primary">موافق</Button>
        </Form.Item>
      </Form>
    );
  };

  function onConfirmChangesClickHandler() {
    let output = UpdateInInvoiceShops(JSON.stringify(conFirmChangesReqBody));
    let key = "updatable";
    message.loading({ content: "جاري التنفيذ", key });
    output.then((result) => {
      if (result === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onConfirmChangesClickHandler());
      } else {
        if (result.updated > 0 || result.deleted > 0) {
          setTimeout(() => {
            message.success({ content: "تم التنفيذ بنجاح", key, duration: 2 });
          }, 1000);
          if (props.setLoadPurchasesReqs !== undefined)
            props.setLoadPurchasesReqs(true);
            
          props.OnOpenPurchaseReqClickHandler();
        } else {
          setTimeout(() => {
            message.success({ content: "حدث خطأ", key, duration: 2 });
          }, 1000);
        }
      }
    });
  }

  const editInvoiceStatusPopOver = () => {
    function onFinish(event) {
      let description;
      if (event.status === "delivered" || event.status === "rejected") {
        description =
          "سيتم نقل الفاتورة الى الارشيف واشعار الزبون بتغير حالة الطلب";
      } else if (event.status === "approved") {
        description =
          "سيتم اشعار الزبون بالموافقة على الطلب وطرح كميات المواد المباعة";
      } else if (event.status === "pending") {
        description =
          "سيتم اشعار الزبون بتغير حالة الطلب وكذلك اضافة كميات المواد المباعة الى المحل";
      }
      confirm({
        title: "هل انت متاكد من تغيير حالة الطلب؟",
        icon: <ExclamationCircleOutlined />,
        content: description,
        okText: "نعم",
        okType: "danger",
        cancelText: "كلا",
        onOk() {
          conFirmChangesReqBody = {
            ...conFirmChangesReqBody,
            newStatus: event.status,
            thereIsChanges: true,
          };
          selectedRequest.status = event.status;
          conFirmChangesReqBody.thereIsChanges = true;
          setSelectedRequest({ ...selectedRequest });
          message.warning("سيتم التنفيذ عند الضغط على زر تنفيذ التعديلات");
        },
        onCancel() {
          // console.log("Cancel");
        },
      });
    }

    let notAvailableItem = selectedRequest.invoiceItems.filter(
      (element) => element.availableQty < element.qty
    );

    return (
      <Form onFinish={onFinish}>
        <Form.Item name={["status"]} initialValue={selectedRequest.status}>
          <Radio.Group>
            <Space direction="vertical" className="grid justify-items-start">
              <Radio value={"pending"}>قيد الانتظار</Radio>
              <Radio
                value={"approved"}
                disabled={
                  notAvailableItem.length === 0 ||
                  selectedRequest.status === "approved"
                    ? false
                    : true
                }
              >
                موافق على الطلب
              </Radio>
              <Radio
                value={"delivered"}
                disabled={
                  notAvailableItem.length === 0 ||
                  selectedRequest.status === "approved"
                    ? false
                    : true
                }
              >
                تم توصيل الطلب
              </Radio>
              <Radio value={"rejected"}>رفض الطلب</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button htmlType="primary">موافق</Button>
        </Form.Item>
      </Form>
    );
  };

  function OnOpenInvoiceChatClickHandler() {
    setDisplayInvoiceChat(!displayInvoiceChat);
  }

  return (
    <div
      className="absolute inset-0 w-full h-full z-10"
      style={{ backgroundColor: "rgba(100, 116, 139, 0.85)" }}
    >
      <div
        className="m-auto h-5/6 w-8/12 bg-slate-800 mt-8 p-4"
        style={{ overflowY: "scroll" }}
      >
        <div className="flex justify-end mb-2">
          <Tooltip placement="right" title={"رجوع"}>
            <img
              src={back_direction}
              alt="back_direction"
              style={{ width: "35px", cursor: "pointer" }}
              className="bg-slate-400 hover:bg-slate-100 p-0.5 rounded-sm pl-2 pr-2"
              onClick={() => {
                // props.setLoadItems(true);
                props.OnOpenPurchaseReqClickHandler();
              }}
            ></img>
          </Tooltip>
        </div>
        {fetchingData ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
          <>
            {" "}
            <Descriptions
              className="mb-4"
              bordered
              //   title=""
              size="middle"
              labelStyle={{ backgroundColor: "rgb(55 65 81)", color: "white" }}
              contentStyle={{ color: "white" }}
              //   extra={<Button type="primary">Edit</Button>}
            >
              <Descriptions.Item label="رقم الفاتورة">
                {selectedRequest.invoiceId}
              </Descriptions.Item>
              <Descriptions.Item label="تاريخ الطلب">
                {selectedRequest.createdAt}
              </Descriptions.Item>
              <Descriptions.Item label="المبلغ الكلي">
                {selectedRequest.totalCost}
              </Descriptions.Item>
              <Descriptions.Item label="المبلغ المدفوع">
                {selectedRequest.paidAmount}
                {props.readOnlyComponent !== true && (
                  <Popover
                    color="rgb(7 89 133)"
                    overlayClassName="text-center"
                    content={editPaidAmountPopOver}
                    destroyTooltipOnHide={true}
                    title="تغيير المبلغ المدفوع"
                    trigger="click"
                    visible={editPaidAmountVisibility.visible}
                    onVisibleChange={(visible) =>
                      setEditPaidAmountVisibility({ visible: visible })
                    }
                  >
                    <EditTwoTone className="mr-3" />
                  </Popover>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="طريقة الدفع">
                {selectedRequest.paymentMethod}
              </Descriptions.Item>
              <Descriptions.Item label="الحالة">
                {selectedRequest.status ===
                  resources.INVOICE_STATUS.PENDING && (
                  <Tag color={"red"}>{`قيد الانتظار`}</Tag>
                )}
                {selectedRequest.status ===
                  resources.INVOICE_STATUS.APPROVED && (
                  <Tag color={"green"}>{`تم الموافقة عليه`}</Tag>
                )}
                {selectedRequest.status ===
                  resources.INVOICE_STATUS.DELIVERED && (
                  <Tag color={"green"}>{`تم التوصيل`}</Tag>
                )}
                {selectedRequest.status ===
                  resources.INVOICE_STATUS.REJECTED && (
                  <Tag color={"volcano"}>{`الطلب مرفوض`}</Tag>
                )}

                {props.readOnlyComponent !== true && (
                  <Popover
                    color="rgb(7 89 133)"
                    overlayClassName="text-center"
                    content={editInvoiceStatusPopOver}
                    destroyTooltipOnHide={true}
                    title="تعديل الحالة"
                    trigger="click"
                    visible={editInvoiceStatusVisibility.visible}
                    onVisibleChange={(visible) =>
                      setEditInvoiceStatusVisibility({ visible: visible })
                    }
                  >
                    <EditTwoTone className="mr-3" />
                  </Popover>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="معلومات الزبون">
                {selectedRequest.customer.name}
                <br />
                {selectedRequest.customer.province}
                <br />
                {selectedRequest.customer.region}
                <br />
                {selectedRequest.customer.mobile}
                <br />
                {selectedRequest.customer.email}
                <br />
                <Button
                  type="link"
                  className="ml-0 mr-0 p-0"
                  onClick={() =>
                    selectedRequest.customer.lat !== null &&
                    setDisplayCustomerLocOnMap(true)
                  }
                >
                  عرض الموقع في الخريطة
                </Button>
                <br />
                <Button
                  type="link"
                  className="ml-0 mr-0 p-0"
                  onClick={OnOpenInvoiceChatClickHandler}
                >
                  {props.readOnlyComponent !== true && "مراسلة المشتري"}
                  {props.readOnlyComponent === true && "عرض المراسلات"}
                </Button>
                <br />
              </Descriptions.Item>
            </Descriptions>
            <Badge.Ribbon text="المواد" className="ml-4 mr-4">
              <Table
                className="ml-4 mr-4"
                rowClassName={
                  selectedRequest.status === resources.INVOICE_STATUS.PENDING
                    ? (record, index) =>
                        record.availableQty < record.qty ? "bg-red-900" : null
                    : null
                }
                dataSource={selectedRequest.invoiceItems}
                columns={itemColumns}
                expandable={{
                  expandedRowRender: (record) => (
                    <p style={{ margin: 0 }} className="flex justify-start">
                      {record.availableQty < record.qty
                        ? `الكمية المتوفرة = ${record.availableQty} , لايمكن اتمام عملية البيع الا اذا تم حذف المادة من الفاتورة او مراسلة المشتري لتغيير الكمية حسب المتوفر`
                        : `الكمية المتوفرة = ${record.availableQty}`}
                    </p>
                  ),

                  rowExpandable: (record) =>
                    selectedRequest.status === resources.INVOICE_STATUS.PENDING,
                }}
                expandedRowKeys={expandedRowKeys}
                onExpand={onTableRowExpand}
              />
            </Badge.Ribbon>
          </>
        )}
        {props.readOnlyComponent !== true && (
          <Space className="flex justify-center">
            <Button
              htmlType="primary"
              danger={true}
              onClick={onConfirmChangesClickHandler}
              disabled={!conFirmChangesReqBody.thereIsChanges}
            >
              تنفيذ التعديلات
            </Button>
          </Space>
        )}
      </div>
      {displayInvoiceChat ? (
        <InvoiceChat
          OnOpenInvoiceChatClickHandler={OnOpenInvoiceChatClickHandler}
          customerName={selectedRequest.customer.name}
          invoiceShopId={selectedRequest.invoiceShopId}
          readOnlyComponent={props.readOnlyComponent}
        />
      ) : null}
      {displayCustomerLocOnMap ? (
        <CustomerLocOnMap
          setDisplayCustomerLocOnMap={setDisplayCustomerLocOnMap}
          customerInfo={selectedRequest.customer}
        />
      ) : null}
    </div>
  );
}

export default PurchaseReqDetails;
