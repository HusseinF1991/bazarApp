import {
  Button,
  Input,
  Select,
  TreeSelect,
  Form,
  List,
  Avatar,
  Skeleton,
  Popconfirm,
  message,
  Space,
  Rate,
  Tooltip,
} from "antd";
import { DeleteTwoTone, MessageOutlined } from "@ant-design/icons";
import back_direction from "../../../images/back_direction.png";
import React, { useEffect, useState } from "react";
import AddItemType from "./addItemType";
import { getBrands } from "../../../api/brands";
import { getCategories } from "../../../api/categories";
import { getOneItemDetails, modifyItem } from "../../../api/items";
import { ManagerAccountInfo } from "../../../store/managerAccountInfo";
import { itemTypeImgUrl } from "../../../api/baseUrl";
import ManageItemType from "./manageItemType";
import ItemReviews from "./itemReviews";
import ErrorInFetch from "../../layout/errorInFetch";
import { resources } from "../../../resource";

let itemMainDetails;
let selectedItemTypeKey;
function ModifyItem(props) {
  const { accountInfo } = ManagerAccountInfo();
  const [displayAddTypeModel, setDisplayAddTypeModel] = useState(false);
  const [itemTypes, setItemTypes] = useState([]);
  const [itemReviews, setItemReviews] = useState({ reviews: [], rate: 0 });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [displayManageItemType, setDisplayManageItemType] = useState(false);
  const [displayItemReviews, setDisplayItemReviews] = useState(false);
  const [fetchingData, setFetchingData] = useState(true); //for the skeleton
  const [reloadUseEffect, setReloadUseEffect] = useState(true);

  useEffect(() => {
    let output = getOneItemDetails(props.selectedItemId);
    output.then((result) => {
      if (result === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => setReloadUseEffect(!reloadUseEffect));
      } else {
        if (result.length > 0) {
          //define new array for itemtypes set it in useState
          let modifiedTypeArr = [];
          result[0].ItemTypes.forEach((typeElement) => {
            let typeImgsArr = [];
            typeElement.ItemTypeImages.forEach((imgElement) => {
              let typeImg = {
                ...imgElement,
                key: typeElement.ItemTypeImages.indexOf(imgElement) + 2,
                preview: `${itemTypeImgUrl}${imgElement.imageLoc}`,
                data: "",
              };
              typeImgsArr.push(typeImg);
            });

            let itemType = {
              ...typeElement,
              ItemTypeImages: typeImgsArr,
              key: result[0].ItemTypes.indexOf(typeElement),
            };
            modifiedTypeArr.push(itemType);
          });

          //count itemRates summation to set ite's average in itemMainDetails
          let ratesSummation = 0;
          result[0].ItemReviews.forEach((element) => {
            ratesSummation = ratesSummation + element.rate;
          });
          const itemRate = ratesSummation / result[0].ItemReviews.length;

          //set itemMainDetails object
          itemMainDetails = {
            ...result[0],
          };

          setItemReviews({ reviews: result[0].ItemReviews, rate: itemRate });
          setItemTypes(modifiedTypeArr);
          setReloadUseEffect(false);
          setFetchingData(false);
        } else {
          message.error("فشل العملية");
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchingData, reloadUseEffect]);

  useEffect(() => {
    async function fetchData() {
      let brandsOutput = await getBrands();
      let categoriesOutput = await getCategories();

      if (brandsOutput === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => fetchData());
      } else {
        brandsOutput.push({ id: "", brandName: "" }); // allow use to not choose any brand

        setBrands(brandsOutput);
      }

      if (categoriesOutput === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => fetchData());
      } else {
        let level1CatTree = [];
        if (categoriesOutput.length > 0) {
          categoriesOutput.forEach((element) => {
            if (element.catLevel === 1) {
              const category = {
                key: element.id,
                id: element.id,
                title: element.catName,
                level: element.catLevel,
                parentId: null,
                isLeaf: false,
              };
              level1CatTree.push(category);
            }
          });
        }
        setCategories(categoriesOutput);
        setTreeData(level1CatTree);
      }
    }
    fetchData();
  }, []);

  function onItemTypeClickedHandler() {
    setDisplayManageItemType(!displayManageItemType);
  }

  function onAddTypeClickedHandler() {
    setDisplayAddTypeModel(!displayAddTypeModel);
  }

  function OnDeleteItemTypeClickHandler(selectedItemType) {
    let newItemTypes = [];
    itemTypes.forEach((element) => {
      if (element.key === selectedItemType.key && element.id !== undefined) {
        let newElement = {
          key: element.key,
          id: element.id,
          deleted: true,
        };
        newItemTypes.push(newElement);
      } else if (element.key !== selectedItemType.key) {
        newItemTypes.push(element);
      }
    });
    setItemTypes(newItemTypes);
    message.success("تم الحذف بنجاح");
  }

  function onItemReviewsClickHandler() {
    setDisplayItemReviews(!displayItemReviews);
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
      if (element.deleted === undefined) {
        element.ItemTypeImages.forEach((oneImage) => {
          if (oneImage.data !== "") {
            formData.append(
              "itemImages",
              oneImage.data,
              element.typeName + oneImage.key
            );
          }
        });
      }
    });
    //send it in one object
    let itemMainDetails = {
      itemCode: event.user.itemCode,
      itemName: event.user.itemName,
      brandId: event.user.brand,
      categoryId: event.user.category,
      shopId: accountInfo.shopId,
      itemId: props.selectedItemId,
    };
    formData.append("itemTypes", JSON.stringify(itemTypes));
    formData.append("itemMainDetails", JSON.stringify(itemMainDetails));

    let output = modifyItem(formData);
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onFinish(event));
      } else {
        if (res.err === undefined) {
          props.OnModifyItemClickHandler();
          //in case its openned from notifications
          if (props.setLoadItems !== undefined) props.setLoadItems(true);
        }
      }
    });
  }

  const IconText = ({ icon, text }) => (
    <Space
      style={{ marginRight: "5px", cursor: "pointer" }}
      onClick={onItemReviewsClickHandler}
      className="text-white hover:text-zinc-400 mt-1"
    >
      {text}
      {React.createElement(icon)}
    </Space>
  );

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
              onClick={() => {
                //in case its openned from notifications
                if (props.setLoadItems !== undefined) props.setLoadItems(true);
                props.OnModifyItemClickHandler();
              }}
            ></img>
          </Tooltip>
        </div>
        {fetchingData ? (
          <Skeleton active paragraph={{ rows: 10 }} />
        ) : (
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
              initialValue={itemMainDetails.itemCode}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "itemName"]}
              rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              label={<label style={{ color: "white" }}>اسم المادة</label>}
              initialValue={itemMainDetails.itemName}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "brand"]}
              label={<label style={{ color: "white" }}>الماركة</label>}
              initialValue={
                itemMainDetails.Brand !== null
                  ? itemMainDetails.Brand.brandName
                  : ""
              }
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
              initialValue={itemMainDetails.Category.catName}
            >
              <TreeSelect
                treeDataSimpleMode
                style={{ width: "100%" }}
                // value={selectedCatValue}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="اختر الصنف رجاءا"
                // onSelect={(value, option) => setSelectedCatValue(value)}
                loadData={onLoadData}
                treeData={treeData}
              />
            </Form.Item>
            <Form.Item
              name={["user", "ItemReview"]}
              label={<label style={{ color: "white" }}>التقييم</label>}
              // rules={[{ required: true, message: "اختر الصنف رجاءا" }]}
              // initialValue={itemMainDetails.Category.catName}
            >
              <Space>
                <Rate disabled value={itemReviews.rate} />
                <IconText
                  icon={MessageOutlined}
                  text={itemReviews.reviews.length}
                  key="list-vertical-message"
                />
              </Space>
            </Form.Item>
            <label style={{ color: "white", marginBotto: "5px" }}>
              انواع المادة
            </label>
            <Form.Item
              name={["user", "itemType"]}
              rules={[
                {
                  validator: (_, value) =>
                    itemTypes.filter((element) => element.deleted === undefined)
                      .length > 0
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("ادخل نوع واحد للمادة على الاقل")
                        ),
                },
              ]}
            >
              <div
                id="scrollableDiv"
                style={{
                  maxHeight: 300,
                  overflow: "auto",
                  padding: "0 16px",
                  border: "1px solid rgba(140, 140, 140, 0.35)",
                  marginTop: 10,
                }}
              >
                <List
                  dataSource={itemTypes}
                  footer={
                    <div>
                      <Button onClick={onAddTypeClickedHandler}>
                        اضافة نوع للمادة
                      </Button>
                    </div>
                  }
                  renderItem={(itemType) => {
                    if (itemType.deleted === undefined) {
                      return (
                        <List.Item key={itemType.key}>
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                src={
                                  itemType.ItemTypeImages.find(
                                    (element) => element.preview !== ""
                                  ).preview
                                }
                              />
                            }
                            title={
                              <Button
                                type="link"
                                onClick={() => {
                                  selectedItemTypeKey = itemType.key;
                                  onItemTypeClickedHandler();
                                }}
                              >
                                {itemType.typeName}
                              </Button>
                            }
                            // description={itemType.email}
                          />
                          <div>
                            <Popconfirm
                              title="هل انت متاكد من الحذف؟"
                              onConfirm={() =>
                                OnDeleteItemTypeClickHandler(itemType)
                              }
                              okText="نعم"
                              cancelText="كلا"
                            >
                              <DeleteTwoTone />
                            </Popconfirm>
                          </div>
                        </List.Item>
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              </div>
            </Form.Item>
            <Form.Item>
              <Button ghost={true} type="primary" htmlType="submit">
                حفظ التعديل
              </Button>
            </Form.Item>
          </Form>
        )}
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
          onItemTypeClickedHandler={onItemTypeClickedHandler}
          selectedItemTypeKey={selectedItemTypeKey}
          itemTypes={itemTypes}
        />
      ) : null}
      {displayItemReviews ? (
        <ItemReviews
          onItemReviewsClickHandler={onItemReviewsClickHandler}
          itemReviews={itemReviews}
          setItemReviews={setItemReviews}
          selectedItemId={itemMainDetails.id}
        />
      ) : null}
    </div>
  );
}

export default ModifyItem;
