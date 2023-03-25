import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Tooltip,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import back_direction from "../../../images/back_direction.png";
import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";

const initialImgObj = {
  key: 1,
  preview: "",
  data: "",
};

function AddItemType(props) {
  const [loadingImg, setLoadingImg] = useState(false);
  const [typeImages, setTypeImages] = useState([initialImgObj]);

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
    setTypeImages(typeImages.filter((element) => element.key !== typeImg.key));
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

  function onFinish(event) {
    event.user = {
      key: props.itemTypes.length + 1,
      ...event.user,
    };
    //because using include of sequilize associations it came with first letter as capital
    event.user.ItemTypeImages = typeImages.filter((item) => item.key !== 1);
    props.setItemTypes([event.user, ...props.itemTypes]);
    props.onAddTypeClickedHandler();
  }

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
              onClick={props.onAddTypeClickedHandler}
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
          // validateMessages={validateMessages}
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
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "availableQty"]}
            label={<label style={{ color: "white" }}>الكمية</label>}
            rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name={["user", "sellPrice"]}
            label={<label style={{ color: "white" }}>سعر الشراء</label>}
            rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name={["user", "purchasePrice"]}
            label={<label style={{ color: "white" }}>سعر البيع</label>}
            rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name={["user", "discountPrice"]}
            label={<label style={{ color: "white" }}>السعر بعد الخصم</label>}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name={["user", "expDate"]}
            label={<label style={{ color: "white" }}>ت نفاذ الصلاحية</label>}
          >
            <DatePicker picker="date" />
          </Form.Item>
          <Form.Item
            name={["user", "description"]}
            label={<label style={{ color: "white" }}>تفاصيل اخرى</label>}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name={["user", "ItemTypeImages"]} //because using include of sequilize associations it came with first letter as capital
            label={<label style={{ color: "white" }}>الصورة</label>}
            rules={[{ required: true, message: "اختر صورة رجاءا" }]}
          >
            <div className="flex justify-start">
              {typeImages.map((item, index) => (
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
                        onChange={(event) => handleImgInputChange(index, event)}
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
              ))}
            </div>
          </Form.Item>
          <Form.Item>
            <Button ghost={true} type="primary" htmlType="submit">
              ادخال
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AddItemType;
