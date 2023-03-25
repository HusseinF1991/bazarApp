import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  Dropdown,
  Space,
  Menu,
  Button,
  Image,
  Spin,
  message,
  Modal,
  Tag,
} from "antd";
import {
  DownOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { deleteOneItem, getItems } from "../../../api/items";
import { ManagerAccountInfo } from "../../../store/managerAccountInfo";
import Highlighter from "react-highlight-words";
import AddItem from "./addItem";
import ModifyItem from "./modifyItem";
import { itemTypeImgUrl } from "../../../api/baseUrl";
import {
  deleteOneItemType,
  modifyItemTypeMainInfo,
} from "../../../api/itemTypes";
import ErrorInFetch from "../../layout/errorInFetch";
import { resources } from "../../../resource";
import { MainMenuSelection } from "../../../store/mainMenuSelection";

const { confirm } = Modal;

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `رجاءا أملأ ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

let searchInput;
let selectedItemId;
function ManageItems() {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const { accountInfo } = ManagerAccountInfo();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [loadItems, setLoadItems] = useState(true);
  const [items, setItems] = useState([]);
  const [displayAddItemModel, setDisplayAddItemModel] = useState(false);
  const [displayModifyItemModel, setDisplayModifyItemModel] = useState(false);
  const [visible, setVisible] = useState(false); //for previewing itemType images
  const [selectedItemTypeImgs, setSelectedItemTypeImgs] = useState([]);
  const [loadingWait, setLoadingWait] = useState(true);
  const [mySearchState, setMySearchState] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const { setSelectedItemInfo } = MainMenuSelection();

  //useEffect for setting selected main menu item
  useEffect(() => {
    setSelectedItemInfo({
      key: resources.MAIN_MENU_ITEMS.MANAGE_ITEMS.KEY,
      title: resources.MAIN_MENU_ITEMS.MANAGE_ITEMS.TITLE,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tblFooter = () => (
    <Button
      type="primary"
      size="default"
      ghost={true}
      onClick={onAddItemHandler}
    >
      اضافة مادة
    </Button>
  );

  const isEditing = (record) => record.key === editingKey;

  useEffect(() => {
    const myReqBody = {
      pageNum: 1,
      shopId: accountInfo.shopId,
    };
    let output = getItems(JSON.stringify(myReqBody));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => setLoadItems(!loadItems));
      } else {
        let data = [];
        res.docs.forEach((element) => {
          element = {
            key: res.docs.indexOf(element) + 1,
            catName: element.Category.catName,
            brandName: element.Brand !== null ? element.Brand.brandName : null,
            ...element,
          };
          data.push(element);
        });
        setItems(data);
        setLoadingWait(false);
        setLoadItems(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadItems]);

  function onAddItemHandler() {
    setDisplayAddItemModel(!displayAddItemModel);
  }

  function OnModifyItemClickHandler() {
    setDisplayModifyItemModel(!displayModifyItemModel);
  }

  function OnDeleteItemHandler(itemId) {
    confirm({
      title: "هل انت متاكد من حذف المادة؟",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: "نعم",
      okType: "danger",
      cancelText: "كلا",
      onOk() {
        onDeleteItem(itemId);
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  }

  function onDeleteItem(itemId) {
    const key = "updatable";
    message.loading({ content: "جاري الحذف", key });
    let output = deleteOneItem(itemId);
    output.then((result) => {
      if (result === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onDeleteItem(itemId));
      } else {
        if (result.deleted > 0) {
          setLoadItems(true);
          setTimeout(() => {
            message.success({ content: "تم الحذف", key, duration: 1 });
          }, 1000);
        } else {
          message.error("حدث خطأ في عملية الحذف");
        }
      }
    });
  }

  function onDeleteItemTypeHandler(typeRecord) {
    confirm({
      title: "هل انت متاكد من حذف النوع هذا؟",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: "نعم",
      okType: "danger",
      cancelText: "كلا",
      onOk() {
        onDeleteItemType(typeRecord);
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  }

  function onDeleteItemType(typeRecord) {
    const key = "updatable";
    message.loading({ content: "جاري الحذف", key });
    let output = deleteOneItemType(typeRecord.id);
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onDeleteItemType(typeRecord));
      } else {
        if (res.deleted !== undefined) {
          setLoadItems(true);
          setTimeout(() => {
            message.success({ content: "تم الحذف", key, duration: 1 });
          }, 1000);
        } else {
          message.error("حدث خطأ في عملية الحذف");
        }
      }
    });
  }

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
    render: (text) =>
      mySearchState.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[mySearchState.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
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

  const itemsColumns = [
    {
      title: "#",
      dataIndex: "key",
      key: "key",
      width: "5%",
      align: "center",
      // editable: false,
    },
    {
      title: "رمز المادة",
      dataIndex: "itemCode",
      key: "itemCode",
      width: "15%",
      align: "center",
      ...getColumnSearchProps("رمز المادة", "itemCode"),
      // editable: true,
    },
    {
      title: "اسم المادة",
      dataIndex: "itemName",
      key: "itemName",
      width: "15%",
      align: "center",
      ...getColumnSearchProps("اسم المادة", "itemName"),
      // editable: true,
    },
    {
      title: "الصنف",
      dataIndex: "catName",
      key: "catName",
      width: "15%",
      align: "center",
      ...getColumnSearchProps("الصنف", "catName"),
      // editable: true,
    },
    {
      title: "الماركة",
      dataIndex: "brandName",
      key: "brandName",
      width: "15%",
      align: "center",
      // editable: true,
    },
    {
      title: "العمليات",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <>
            <Typography.Link
              onClick={() => {
                selectedItemId = record.id;
                OnModifyItemClickHandler();
              }}
            >
              تعديل
            </Typography.Link>

            <Button
              type="link"
              size="default"
              onClick={() => OnDeleteItemHandler(record.id)}
            >
              {" "}
              حذف{" "}
            </Button>
            {record.ItemReviews !== undefined &&
            record.ItemReviews.length !== 0 ? (
              <Tag color={"volcano"}>
                {`${record.ItemReviews.length} تعليق`}
              </Tag>
            ) : null}
          </>
        );
      },
    },
  ];

  const edit = (record) => {
    form.setFieldsValue({
      // name: "",
      // age: "",
      // address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancelEditingItemType = () => {
    setEditingKey("");
  };

  function onChangePageHandler(page, pageSize) {
    setEditingKey("");

    const myReqBody = {
      pageNum: page,
      shopId: accountInfo.shopId,
    };
    console.log(myReqBody);
    let output = getItems(JSON.stringify(myReqBody));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onChangePageHandler(page, pageSize));
      } else {
        let data = [];
        res.cols.forEach((element) => {
          element = {
            key: res.cols.indexOf(element) + 1,
            catName: element.Category.catName,
            ...element,
          };
          data.push(element);
        });
        setItems(data);
      }
    });
  }

  //take only the last expanded row and set it in useState => other rows will be shrinked
  function onTableRowExpand(expanded, record) {
    const keys = [];
    if (expanded) {
      keys.push(record.key); // I have set my record.id as row key. Check the documentation for more details.
    }

    setEditingKey("");
    setExpandedRowKeys(keys);
  }

  async function save(record) {
    setLoadingWait(true);
    const itemId = record.itemId;
    const itemTypeId = record.id;
    try {
      const row = await form.validateFields();

      const newItemsData = [...items];
      const itemsIndex = newItemsData.findIndex((item) => itemId === item.id);
      if (itemsIndex > -1) {
        const itemTypeIndex = newItemsData[itemsIndex].ItemTypes.findIndex(
          (itemType) => itemTypeId === itemType.id
        );

        if (itemTypeIndex > -1) {
          const itemType = newItemsData[itemsIndex].ItemTypes[itemTypeIndex];
          newItemsData[itemsIndex].ItemTypes.splice(itemTypeIndex, 1, {
            ...itemType,
            ...row,
          });

          //modify itemType main info sellPrice ,purchasePrice , discount , qty and name in database
          let output = modifyItemTypeMainInfo(
            JSON.stringify({ id: itemTypeId, ...row })
          );
          output.then((response) => {
            if (response === resources.FAILED_TO_FETCH) {
              setLoadingWait(false);
              ErrorInFetch(() => save(record));
            } else {
              if (response === resources.FAILED_TO_FETCH) {
                setLoadingWait(false);
                ErrorInFetch(() => save(record));
              } else {
                if (response.modified === 1) {
                  setItems(newItemsData);
                  setEditingKey("");
                  setLoadingWait(false);
                } else {
                  setEditingKey("");
                  setLoadingWait(false);
                  message.error("فشل في التعديل");
                }
              }
            }
          });
        }
      }
    } catch (errInfo) {
      setLoadingWait(false);
      console.log("Validate Failed:", errInfo);
    }
  }

  const expandedRowRender = (record) => {
    const itemTypesColumns = [
      {
        title: "اسم النوع",
        dataIndex: "typeName",
        key: "typeName",
        align: "center",
        editable: true,
      },
      {
        title: "الكمية",
        dataIndex: "availableQty",
        key: "availableQty",
        align: "center",
        editable: true,
      },
      {
        title: "سعر الشراء",
        dataIndex: "purchasePrice",
        key: "purchasePrice",
        align: "center",
        editable: true,
      },
      {
        title: "سعر البيع",
        dataIndex: "sellPrice",
        key: "sellPrice",
        align: "center",
        editable: true,
      },
      {
        title: "السعر بعد التخفيض",
        dataIndex: "discountPrice",
        key: "discountPrice",
        align: "center",
        editable: true,
      },
      {
        title: "اخر تحديث",
        dataIndex: "updatedAt",
        key: "updatedAt",
        align: "center",
        editable: false,
      },
      {
        title: "العمليات",
        dataIndex: "operation",
        key: "operation",
        align: "center",
        render: (_, typeRecord) => {
          const editable = isEditing(typeRecord);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => save(typeRecord)}
                style={{
                  marginRight: 8,
                }}
              >
                حفظ
              </Typography.Link>
              <Popconfirm
                title="هل انت متاكد من الالغاء؟"
                onConfirm={cancelEditingItemType}
                okText="نعم"
                cancelText="كلا"
              >
                <Button type="link" size="default">
                  {" "}
                  اغلاق{" "}
                </Button>
              </Popconfirm>
            </span>
          ) : (
            <Space size="middle">
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => edit(typeRecord)}
              >
                تعديل
              </Typography.Link>
              <Dropdown
                overlay={() => itemTypeOpMenu(typeRecord)}
                disabled={editingKey !== ""}
              >
                <Button type="link" size="default">
                  المزيد <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          );
        },
      },
    ];

    const mergedColumns = itemTypesColumns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === "typeName" ? "text" : "number",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });

    const itemTypes = [];
    record.ItemTypes.forEach((type) => {
      let createdAtDNum = Date.parse(type.createdAt);
      let createdAtD = new Date(createdAtDNum);
      type.createdAt = createdAtD.toLocaleString("en-US");
      let updatedAtDNum = Date.parse(type.updatedAt);
      let updatedAtD = new Date(updatedAtDNum);
      type.updatedAt = updatedAtD.toLocaleString("en-US");
      itemTypes.push({
        key: record.ItemTypes.indexOf(type) + 1,
        ...type,
      });
    });

    const itemTypeOpMenu = (typeRecord) => (
      <Menu
        onClick={(event) => onItemTypeOpMenuClickHandler(typeRecord, event)}
      >
        <Menu.Item key={1}>عرض المعلومات كاملة</Menu.Item>
        <Menu.Item key={2}>ايقاف العرض في التطبيق</Menu.Item>
        {record.ItemTypes.length > 1 && <Menu.Item key={3}>حذف</Menu.Item>}
        <Menu.Item key={4}>الصور</Menu.Item>
      </Menu>
    );

    return (
      <Table
        columns={mergedColumns}
        dataSource={itemTypes}
        pagination={false}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        rowClassName="editable-row"
      />
    );
  };

  function onItemTypeOpMenuClickHandler(typeRecord, event) {
    switch (event.key) {
      case "1": //show selected item type full info in new component
        break;
      case "2": //stop display item type in the app
        break;
      case "3": //delete itemType
        onDeleteItemTypeHandler(typeRecord);
        break;
      case "4": //display item type images
        setSelectedItemTypeImgs(typeRecord.ItemTypeImages);
        setVisible(!visible);
        break;
      default:
        break;
    }
  }

  return (
    <>
      <Spin size="large" spinning={loadingWait && loadItems}>
        <Form form={form} component={false}>
          <Table
            // className="text-center"
            size={"small"}
            expandable={{ expandedRowRender }}
            bordered
            dataSource={items}
            columns={itemsColumns}
            pagination={{
              onChange: onChangePageHandler,
            }}
            footer={tblFooter}
            scroll={{ y: 340 }}
            expandedRowKeys={expandedRowKeys}
            onExpand={onTableRowExpand}
          />
        </Form>
        <div style={{ display: "none" }}>
          <Image.PreviewGroup
            preview={{
              visible,
              onVisibleChange: (vis) => setVisible(vis),
            }}
          >
            {selectedItemTypeImgs.length > 0
              ? selectedItemTypeImgs.map((img) => {
                  return (
                    <Image
                      key={selectedItemTypeImgs.indexOf(img)}
                      src={`${itemTypeImgUrl}${img.imageLoc}`}
                    />
                  );
                })
              : null}
          </Image.PreviewGroup>
        </div>
      </Spin>
      {displayAddItemModel ? (
        <AddItem
          onAddItemHandler={onAddItemHandler}
          setLoadItems={setLoadItems}
        />
      ) : null}
      {displayModifyItemModel ? (
        <ModifyItem
          OnModifyItemClickHandler={OnModifyItemClickHandler}
          selectedItemId={selectedItemId}
          setLoadItems={setLoadItems}
        />
      ) : null}
    </>
  );
}

export default ManageItems;
