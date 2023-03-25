import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Skeleton,
  Tooltip,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import back_direction from "../../../images/back_direction.png";
import moment from "moment";

const initialImgObj = {
  key: 1,
  preview: "",
  data: "",
};

let itemTypeDetails;
function ManageItemType(props) {
  const [loadingImg, setLoadingImg] = useState(false);
  const [typeImages, setTypeImages] = useState([initialImgObj]);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    itemTypeDetails = props.itemTypes.find(
      (type) => type.key === props.selectedItemTypeKey
    );
    setTypeImages([...itemTypeDetails.ItemTypeImages, ...typeImages]);
    setFetchingData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onFinish(event) {
    let index;
    let newType;
    let currentTypeImgs = await typeImages.filter((item) => item.key !== 1);

    await props.itemTypes.forEach((type) => {
      if (type.key === props.selectedItemTypeKey) {
        index = props.itemTypes.indexOf(type);
        newType = {
          ...type,
          // key: props.itemTypes.length + 1,
          ItemTypeImages: currentTypeImgs,
          typeName: event.user.typeName,
          sellPrice: event.user.sellPrice,
          purchasePrice: event.user.purchasePrice,
          discountPrice: event.user.discountPrice,
          availableQty: event.user.availableQty,
          description: event.user.description,
          expDate: event.user.expDate,
        };
      }
    });
    await props.itemTypes.splice(index, 1, newType);
    props.onItemTypeClickedHandler();
  }

  function handleImgInputChange(index, event) {
    const keys = typeImages.map((object) => {
      return object.key;
    });
    const maxKey = Math.max(...keys);
    const img = {
      key: maxKey + 1,
      mimeType: event.target.files[0].type,
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };

    setTypeImages([img, ...typeImages]);
    setLoadingImg(false);
  }

  function onDeleteImageHandler(typeImg) {
    let newTypeImages = [];
    typeImages.forEach((element) => {
      if (element.key === typeImg.key && element.data === "") {
        let newElement = {
          key: element.key,
          id: element.id,
          deleted: true,
          preview: "",
          data: "",
          imageLoc: element.imageLoc,
        };
        newTypeImages.push(newElement);
      } else if (element.key !== typeImg.key) {
        newTypeImages.push(element);
      }
    });
    setTypeImages(newTypeImages);
  }

  const uploadButton = (
    <div>
      {loadingImg ? (
        <LoadingOutlined style={{ color: "white" }} />
      ) : (
        <PlusOutlined style={{ color: "white" }} />
      )}
      <div style={{ marginTop: 8, color: "white" }}>اختر الصورة</div>
    </div>
  );

  return (
    <div
      className="absolute inset-0 w-full h-full z-20"
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
              onClick={props.onItemTypeClickedHandler}
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
            initialValues={{
              size: "default",
            }}
            size={"default"}
            onFinish={onFinish}
          >
            <Form.Item
              name={["user", "typeName"]}
              label={<label style={{ color: "white" }}>اسم النوع</label>}
              rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              initialValue={itemTypeDetails.typeName}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "availableQty"]}
              label={<label style={{ color: "white" }}>الكمية</label>}
              rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              initialValue={itemTypeDetails.availableQty}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              name={["user", "sellPrice"]}
              label={<label style={{ color: "white" }}>سعر الشراء</label>}
              rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              initialValue={itemTypeDetails.sellPrice}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              name={["user", "purchasePrice"]}
              label={<label style={{ color: "white" }}>سعر البيع</label>}
              rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              initialValue={itemTypeDetails.purchasePrice}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              name={["user", "discountPrice"]}
              label={<label style={{ color: "white" }}>السعر بعد الخصم</label>}
              initialValue={
                itemTypeDetails.discountPrice !== 0 &&
                itemTypeDetails.discountPrice
              }
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              name={["user", "expDate"]}
              label={<label style={{ color: "white" }}>ت نفاذ الصلاحية</label>}
              initialValue={
                itemTypeDetails.expDate !== null &&
                itemTypeDetails.expDate !== undefined
                  ? moment(itemTypeDetails.expDate)
                  : null
              }
            >
              <DatePicker picker="date" />
            </Form.Item>
            <Form.Item
              name={["user", "description"]}
              label={<label style={{ color: "white" }}>تفاصيل اخرى</label>}
              initialValue={itemTypeDetails.description}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name={["user", "typeImages"]}
              label={<label style={{ color: "white" }}>الصورة</label>}
              //   rules={[{ required: true, message: "اختر صورة رجاءا" }]}
              rules={[
                {
                  validator: (_, value) =>
                    typeImages.length > 0 &&
                    typeImages.some((element) => element.preview !== "")
                      ? Promise.resolve()
                      : Promise.reject(new Error("اختر صورة رجاءا")),
                },
              ]}
            >
              <div className="flex justify-start">
                {typeImages.map((item, index) => {
                  if (item.deleted !== true)
                    return (
                      <div key={item.key}>
                        {item.preview ? (
                          <Popconfirm
                            title="هل انت متاكد من الحذف؟"
                            onConfirm={() => onDeleteImageHandler(item)}
                            // onCancel={() => console.log("cancel")}
                            okText="نعم"
                            cancelText="كلا"
                          >
                            <Button className="h-24 w-24 p-0">
                              <img
                                src={item.preview}
                                alt="avatar"
                                style={{ width: "100%" }}
                              />
                            </Button>
                          </Popconfirm>
                        ) : (
                          <>
                            <input
                              type="file"
                              style={{ display: "none" }}
                              id={`typeImagesInput${index}`}
                              onChange={(event) =>
                                handleImgInputChange(index, event)
                              }
                            />
                            <Button
                              onClick={() =>
                                document
                                  .getElementById(`typeImagesInput${index}`)
                                  .click()
                              }
                              className="h-24 w-24 p-0"
                            >
                              {uploadButton}
                            </Button>
                          </>
                        )}
                      </div>
                    );
                  return null;
                })}
              </div>
            </Form.Item>
            <Form.Item>
              <Button ghost={true} type="primary" htmlType="submit">
                تعديل
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
}

export default ManageItemType;
