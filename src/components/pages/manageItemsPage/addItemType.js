import { Button, DatePicker, Form, Input, InputNumber } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import back_direction from "../../../images/back_direction.png";
import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";

const initialLogoObj = [
  {
    key: 1,
    preview: "",
    data: "",
  },
];

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

function AddItemType(props) {
  const [loadingImg, setLoadingImg] = useState(false);
  const [logo, setLogo] = useState(initialLogoObj);

  function handleLogoInputChange(event) {
    const img = {
      key: logo.length + 1,
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };

    setLogo([img, ...logo]);
    setLoadingImg(false);
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
      key : props.itemTypes.length + 1,
      ...event.user
    }
    event.user.logo = logo.filter(item => item.key !== 1);

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
          <img
            src={back_direction}
            alt="back_direction"
            style={{ width: "35px", cursor: "pointer" }}
            className="bg-slate-400 hover:bg-slate-100 p-0.5 rounded-sm pl-2 pr-2"
            onClick={props.onAddTypeClickedHandler}
          ></img>
        </div>
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          validateMessages={validateMessages}
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
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "availableQty"]}
            label={<label style={{ color: "white" }}>الكمية</label>}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name={["user", "sellPrice"]}
            label={<label style={{ color: "white" }}>سعر الشراء</label>}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item
            name={["user", "purchasePrice"]}
            label={<label style={{ color: "white" }}>سعر البيع</label>}
            rules={[{ required: true }]}
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
            <DatePicker picker="date"/>
          </Form.Item>
          <Form.Item
            name={["user", "description"]}
            label={<label style={{ color: "white" }}>تفاصيل اخرى</label>}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name={["user", "logo"]}
            label={<label style={{ color: "white" }}>الصورة</label>}
            rules={[{ required: true }]}
          >
            <div className="flex justify-start">
              {logo.map((item, index) => (
                <div key={item.key}>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    id={`shopLogoInput${index}`}
                    onChange={handleLogoInputChange}
                  />
                  <Button
                    onClick={() =>
                      document.getElementById(`shopLogoInput${index}`).click()
                    }
                    className="h-24 w-24 p-0"
                  >
                    {item.preview ? (
                      <img
                        src={item.preview}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Button>
                </div>
              ))}
            </div>
            {/* <input
              type="file"
              style={{ display: "none" }}
              id="shopLogoInput"
              onChange={handleLogoInputChange}
            />
            <Button
              onClick={() => document.getElementById("shopLogoInput").click()}
              className="h-24 w-24 p-0"
            >
              {logo.preview ? (
                <img
                  src={logo.preview}
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Button> */}
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
