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
  Badge,
  Button,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getItems } from "../../../api/items";
import { ManagerAccountInfo } from "../../../store/managerAccountInfo";
import AddItem from "./addItem";
const originData = [];

for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

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
              message: `Please Input ${title}!`,
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

function ManageItems() {
  const { accountInfo } = ManagerAccountInfo();
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const [loadItems, setLoadItems] = useState(true);
  const [items, setItems] = useState(originData);
  const [displayAddItemModel, setDisplayAddItemModel] = useState(false);

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
      let data = [];
      res.docs.forEach((element) => {
        element = {
          key: res.docs.indexOf(element) + 1,
          catName: element.Category.catName,
          ...element,
        };
        data.push(element);
      });
      setItems(data);
    });
  }, [loadItems]);

  function onAddItemHandler() {
    setDisplayAddItemModel(!displayAddItemModel);
  }

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      width: "5%",
      editable: true,
    },
    {
      title: "رمز المادة",
      dataIndex: "itemCode",
      width: "15%",
      editable: true,
    },
    {
      title: "اسم المادة",
      dataIndex: "itemName",
      width: "15%",
      editable: true,
    },
    {
      title: "الصنف",
      dataIndex: "catName",
      width: "15%",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={onChangePageHandler}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
        );
      },
    },
  ];

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const onChangePageHandler = (page, pageSize) => {
    setEditingKey("");

    const myReqBody = {
      pageNum: page,
      shopId: accountInfo.shopId,
    };
    let output = getItems(JSON.stringify(myReqBody));
    output.then((res) => {
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
    });
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const expandedRowRender = () => {
    const columns = [
      { title: "Date", dataIndex: "date", key: "date" },
      { title: "Name", dataIndex: "name", key: "name" },
      {
        title: "Status",
        key: "state",
        render: () => (
          <span>
            <Badge status="success" />
            Finished
          </span>
        ),
      },
      { title: "Upgrade Status", dataIndex: "upgradeNum", key: "upgradeNum" },
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        render: () => (
          <Space size="middle">
            <a>Pause</a>
            <a>Stop</a>
            <Dropdown overlay={menu}>
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </Space>
        ),
      },
    ];

    const menu = (
      <Menu>
        <Menu.Item>Action 1</Menu.Item>
        <Menu.Item>Action 2</Menu.Item>
      </Menu>
    );

    const data = [];
    for (let i = 0; i < 3; ++i) {
      data.push({
        key: i,
        date: "2014-12-24 23:12:00",
        name: "This is production name",
        upgradeNum: "Upgraded: 56",
      });
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          size={"small"}
          expandable={{ expandedRowRender }}
          bordered
          dataSource={items}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: onChangePageHandler,
          }}
          footer={tblFooter}
          scroll={{ y:300}}
        />
      </Form>
      {displayAddItemModel ? <AddItem onAddItemHandler={onAddItemHandler}/> : null}
    </>
  );
}

export default ManageItems;
