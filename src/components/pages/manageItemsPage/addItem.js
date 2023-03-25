import {
  Button,
  Input,
  Select,
  TreeSelect,
  Form,
  List,
  Carousel,
  Descriptions,
  Popconfirm,
  Tooltip,
  message,
} from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import back_direction from "../../../images/back_direction.png";
import React, { useEffect, useState } from "react";
import AddItemType from "./addItemType";
import { getBrands } from "../../../api/brands";
import { getCategories } from "../../../api/categories";
import { addNewItem } from "../../../api/items";
import { ManagerAccountInfo } from "../../../store/managerAccountInfo";
import ManageItemType from "./manageItemType";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";

let selectedItemTypeKey;
function AddItem(props) {
  const { accountInfo } = ManagerAccountInfo();
  const [displayAddTypeModel, setDisplayAddTypeModel] = useState(false);
  const [itemTypes, setItemTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [displayManageItemType, setDisplayManageItemType] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let brandsOutput = await getBrands();
      let categoriesOutput = await getCategories();

      if (brandsOutput === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => fetchData());
      } else {
        brandsOutput.push({ id: "", brandName: "" });
        setBrands(brandsOutput);
      }

      if (categoriesOutput === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => fetchData());
      } else {
        let level1CatTree = [];
        if (categoriesOutput.length > 0) {
          categoriesOutput.forEach((element) => {
            if (element.catLevel === 1) {
              const branch = {
                key: element.id,
                id: element.id,
                title: element.catName,
                level: element.catLevel,
                parentId: null,
                isLeaf: false,
              };
              level1CatTree.push(branch);
            }
          });
        }
        setCategories(categoriesOutput);
        setTreeData(level1CatTree);
      }
    }
    fetchData();
  }, []);

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
      categories.forEach((element) => {
        if (element.parentCatId === node.id) {
          const branch = {
            key: element.id,
            id: element.id,
            title: element.catName,
            level: element.catLevel,
            parentId: node.id,
            isLeaf: false,
          };
          loadedLvlCatTree.push(branch);
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

  async function onFinish(event) {
    let formData = new FormData();

    itemTypes.forEach((element) => {
      element.ItemTypeImages.forEach((oneImage) => {
        formData.append(
          "itemImages",
          oneImage.data,
          element.typeName + oneImage.key
        );
      });
    });
    formData.append("itemTypes", JSON.stringify(itemTypes));
    formData.append("itemCode", event.user.itemCode);
    formData.append("itemName", event.user.itemName);
    formData.append("brandId", event.user.brand);
    formData.append("categoryId", event.user.category);
    formData.append("shopId", accountInfo.shopId);
    let output = addNewItem(formData);
    output.then((res) => {
      const key = "updatable";
      message.loading({ content: "جاري الاضافة", key });
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onFinish(event));
      } else {
        if (res.err === undefined) {
          props.onAddItemHandler();
          props.setLoadItems(true);

          setTimeout(() => {
            message.success({
              content: "تم اضافة المادة بنجاح",
              key,
              duration: 1,
            });
          }, 1000);
        } else {
          message.error("حدث خطأ في عملية الاضافة");
        }
      }
    });
  }

  function deleteItemTypeHandler(item) {
    setItemTypes(itemTypes.filter((element) => element.key !== item.key));
  }

  function editItemTypeHandler() {
    setDisplayManageItemType(!displayManageItemType);
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
          <Tooltip placement="right" title={"رجوع"}>
            <img
              src={back_direction}
              alt="back_direction"
              style={{ width: "35px", cursor: "pointer" }}
              className="bg-slate-400 hover:bg-slate-100 p-0.5 rounded-sm pl-2 pr-2"
              onClick={props.onAddItemHandler}
            ></img>
          </Tooltip>
        </div>
        <Form
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
            rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
            label={<label style={{ color: "white" }}>رمز المادة</label>}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "itemName"]}
            rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
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
                <Select.Option key={item.id} value={item.id}>
                  {item.brandName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name={["user", "category"]}
            label={<label style={{ color: "white" }}>صنف المادة</label>}
            rules={[{ required: true, message: "اختر الصنف رجاءا" }]}
          >
            <TreeSelect
              treeDataSimpleMode
              style={{ width: "100%" }}
              dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
              placeholder="اختر الصنف رجاءا"
              loadData={onLoadData}
              treeData={treeData}
            />
          </Form.Item>
          <label style={{ color: "white", marginBotto: "5px" }}>
            انواع المادة
          </label>
          <Form.Item
            name={["user", "itemType"]}
            rules={[
              {
                validator: (_, value) =>
                  itemTypes.length > 0
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("ادخل على الاقل نوع واحد للمادة")
                      ),
              },
            ]}
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
                  actions={[
                    <Tooltip title="حذف النوع">
                      <Popconfirm
                        title="هل انت متاكد من الحذف؟"
                        onConfirm={() => deleteItemTypeHandler(item)}
                        okText="نعم"
                        cancelText="كلا"
                      >
                        <DeleteTwoTone />
                      </Popconfirm>
                    </Tooltip>,
                    <Tooltip title="تعديل النوع">
                      <EditTwoTone
                        onClick={() => {
                          selectedItemTypeKey = item.key;
                          editItemTypeHandler();
                        }}
                      />
                    </Tooltip>,
                  ]}
                  extra={
                    <div className="flex justify-end mb-2 mt-10">
                      <Carousel autoplay className="w-36 mr-3">
                        {item.ItemTypeImages !== undefined
                          ? item.ItemTypeImages.map((element) => (
                              <img
                                key={element.key}
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
                      {item.expDate !== undefined && item.expDate !== null
                        ? item.expDate.format("MMMM Do YYYY")
                        : null}
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
      {displayManageItemType ? (
        <ManageItemType
          onItemTypeClickedHandler={editItemTypeHandler}
          selectedItemTypeKey={selectedItemTypeKey}
          itemTypes={itemTypes}
        />
      ) : null}
    </div>
  );
}

export default AddItem;
