import {
  Button,
  Input,
  Select,
  TreeSelect,
  Form,
  List,
  Carousel,
  Descriptions,
} from "antd";
import back_direction from "../../../images/back_direction.png";
import { useEffect, useState } from "react";
import AddItemType from "./addItemType";
import { getBrands } from "../../../api/brands";
import { getCategories } from "../../../api/categories";

function AddItem(props) {
  const [displayAddTypeModel, setDisplayAddTypeModel] = useState(false);
  const [itemTypes, setItemTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadComponent, setLoadComponent] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [selectedCatValue, setSelectedCatValue] = useState("");

  // const IconText = ({ icon, text }) => (
  //   <Space>
  //     {icon}
  //     {text}
  //   </Space>
  // );

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

  useEffect(() => {
    async function fetchData() {
      let brandsOutput = await getBrands();
      let categoriesOutput = await getCategories();

      setBrands(brandsOutput);

      let level1CatTree = [];
      let keyCount = 0;
      if (categoriesOutput.length > 0) {
        categoriesOutput.forEach((element) => {
          if (element.catLevel === 1) {
            const branch = {
              key: keyCount.toString(),
              id: element.id,
              title: element.catName,
              level: element.catLevel,
              parentId: null,
              isLeaf: false,
            };
            level1CatTree.push(branch);
            keyCount++;
          }
        });
      }
      setCategories(categoriesOutput);
      setTreeData(level1CatTree);
    }
    fetchData();
  }, [loadComponent]);

  function onAddTypeClickedHandler() {
    setDisplayAddTypeModel(!displayAddTypeModel);
  }

  const onLoadData = (node) =>
    new Promise((resolve) => {
      if (node.children) {
        resolve();
        return;
      }

      let loadedLvlCatTree = [];
      let keyCount = 0;
      categories.forEach((element) => {
        if (
          element.catLevel === node.level + 1 &&
          element.parentCatId === node.id
        ) {
          const branch = {
            key: `${node.key}-${keyCount.toString()}`,
            id: element.id,
            title: element.catName,
            level: element.catLevel,
            parentId: node.id,
            isLeaf: false,
          };
          loadedLvlCatTree.push(branch);
          keyCount++;
        }
      });
      setTimeout(() => {
        setTreeData((origin) =>
          updateTreeData(origin, node.key, loadedLvlCatTree)
        );
        resolve();
      }, 300);
    });

  function updateTreeData(list, key, children) {
    return list.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }

      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  }

  function onFinish(event) {

    console.log(event);
    props.onAddItemHandler();
  }

  return (
    <div
      className="absolute inset-0 w-full h-full z-10"
      style={{ backgroundColor: "rgba(100, 116, 139, 0.85)" }}
    >
      <div
        className="m-auto h-5/6 w-6/12 bg-slate-800 mt-8 p-4"
        style={{ overflowY: "scroll" }}
      >
        <div className="flex justify-end mb-2">
          <img
            src={back_direction}
            alt="back_direction"
            style={{ width: "35px", cursor: "pointer" }}
            className="bg-slate-400 hover:bg-slate-100 p-0.5 rounded-sm pl-2 pr-2"
            onClick={props.onAddItemHandler}
          ></img>
        </div>
        <Form
          validateMessages={validateMessages}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          size={"default"}
          onFinish={onFinish}
        >
          <Form.Item
            name={["user", "itemCode"]}
            rules={[{ required: true }]}
            label={<label style={{ color: "white" }}>رمز المادة</label>}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "itemName"]}
            rules={[{ required: true }]}
            label={<label style={{ color: "white" }}>اسم المادة</label>}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "brand"]}
            label={<label style={{ color: "white" }}>الماركة</label>}
          >
            <Select>
              {brands.map((item) => (
                <Select.Option key={item.id} value={item.brandName}>
                  {item.brandName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={["user", "category"]}
            label={<label style={{ color: "white" }}>صنف المادة</label>}
          >
            <TreeSelect
              treeDataSimpleMode
              style={{ width: "100%" }}
              value={selectedCatValue}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="Please select"
              onChange={(value) => setSelectedCatValue(value)}
              loadData={onLoadData}
              treeData={treeData}
            />
          </Form.Item>
          {/* <Form.Item label="Switch" valuePropName="checked"> */}
          {/* <Switch />         */}
          {/* </Form.Item> */}
          <label style={{ color: "white", marginBotto: "5px" }}>
            انواع المادة
          </label>
          <Form.Item
            name={["user", "itemType"]}
            // rules={[{ required: true }]}
          // label={<label style={{ color: "white" }}>انواع المادة</label>}
          >
            <List
              itemLayout="vertical"
              size="default"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 2,
              }}
              dataSource={itemTypes}
              footer={
                <div>
                  <Button onClick={onAddTypeClickedHandler}>
                    اضافة نوع للمادة
                  </Button>
                </div>
              }
              renderItem={(item) => (
                <List.Item
                  key={item.key}
                  // actions={[
                  //   <IconText
                  //     icon={<StarOutlined />}
                  //     text="156"
                  //     key="list-vertical-star-o"
                  //   />,
                  //   <IconText
                  //     icon={<LikeOutlined />}
                  //     text="156"
                  //     key="list-vertical-like-o"
                  //   />,
                  //   <IconText
                  //     icon={<MessageOutlined />}
                  //     text="2"
                  //     key="list-vertical-message"
                  //   />,
                  // ]}
                  extra={
                    <div className="flex justify-end mb-2 mt-10">
                      <Carousel autoplay className="w-36 mr-3">
                        {item.logo !== undefined
                          ? item.logo.map((element) => (
                              <img
                                width={272}
                                alt="logo"
                                src={element.preview}
                              />
                            ))
                          : null}
                      </Carousel>
                    </div>
                  }
                >
                  {/* <List.Item.Meta
                    // avatar={<Avatar src={item.avatar} />}
                    title={<a href={item.href}>{item.typeName}</a>}
                    description={item.description}
                  /> */}
                  <Descriptions
                    className="w-full"
                    column={2}
                    bordered
                    labelStyle={{ width: "30px" }}
                    contentStyle={{ width: "80px" }}
                    size="small"
                    // title="Custom Size"
                    // layout="vertical"
                    // extra={<Button type="primary">Edit</Button>}
                  >
                    <Descriptions.Item
                      label="اسم النوع"
                      contentStyle={{ color: "white" }}
                    >
                      {item.typeName}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="الكمية"
                      contentStyle={{ color: "white" }}
                    >
                      {item.availableQty}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="سعر الشراء"
                      contentStyle={{ color: "white" }}
                    >
                      {item.purchasePrice}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="سعر البيع"
                      contentStyle={{ color: "white" }}
                    >
                      {item.sellPrice}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="السعر بعد الخصم"
                      contentStyle={{ color: "white" }}
                    >
                      {item.discountPrice}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="ت نفاذ الصلاحية"
                      contentStyle={{ color: "white" }}
                    >
                      {item.expDate !== undefined ? item.expDate.format("MMMM Do YYYY") : null}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label="تفاصيل اخرى"
                      contentStyle={{ color: "white" }}
                    >
                      {item.description}
                    </Descriptions.Item>
                  </Descriptions>
                </List.Item>
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button ghost={true} type="primary" htmlType="submit">
              ادخال
            </Button>
          </Form.Item>
        </Form>
      </div>
      {displayAddTypeModel ? (
        <AddItemType
          onAddTypeClickedHandler={onAddTypeClickedHandler}
          setItemTypes={setItemTypes}
          itemTypes={itemTypes}
        />
      ) : null}
    </div>
  );
}

export default AddItem;
