import { Button, Form, Input, InputNumber, message, Upload } from "antd";
import { useRef, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
// import { classes } from "./addShop.module.css";
import { addNewShop } from "../../../api/shops";

function AddShop(props) {
  const [loadingImg, setLoadingImg] = useState(false);
  const [logo, setLogo] = useState({ preview: "", data: "" });
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

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

  const onFinish = (values) => {
    let formData = new FormData();
    formData.append("logo", logo.data);
    formData.append("name", values.user.name.trim());
    formData.append("location", values.user.location.trim());
    formData.append("specialty", values.user.specialty.trim());
    formData.append("email", values.user.email);
    formData.append("profitRate", values.user.profitRate);
    formData.append("username", values.user.username.trim());
    formData.append("password", values.user.password.trim());
    let output = addNewShop(formData);
    output.then((result) => {
      if(result.err !== null && result.err === "usernameDuplicated"){
        
        message.error('اسم المستخدم موجود مسبقا');
      }
      else if(result.err !== null && result.err === "shopNameDuplicated"){

        message.error('اسم المحل موجود مسبقا');
      }
      else if(result.data !== null && result.data === "successfullyAdded"){

        message.success('تم اضافة محل جديد بنجاح');
        props.setTblHasData(!props.tblHasData);
        props.ShowAddNewShopHandler();
      }
    });
  };

  function handleLogoInputChange(event) {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setLogo(img);
    setLoadingImg(false);
  }


  /// depricated
  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoadingImg(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        // setImageUrl(imageUrl);
        setLoadingImg(false);
      });
    }
  };

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
      className="absolute inset-0 w-full h-full z-10"
      style={{ backgroundColor: "rgba(100, 116, 139, 0.85)" }}
    >
      <div className="m-auto w-6/12 bg-slate-800 mt-8 p-4">
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Form.Item
            label={<label style={{ color: "white" }}>اسم المحل</label>}
            name={["user", "name"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "specialty"]}
            label={<label style={{ color: "white" }}>التخصص</label>}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "email"]}
            label={<label style={{ color: "white" }}>ايميل</label>}
            rules={[{ type: "email", min: 0, max: 99 }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "location"]}
            label={<label style={{ color: "white" }}>الموقع</label>}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "profitRate"]}
            label={<label style={{ color: "white" }}>نسبة الربح</label>}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "username"]}
            label={<label style={{ color: "white" }}>اسم المستخدم</label>}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "password"]}
            label={<label style={{ color: "white" }}>الرمز السري</label>}
            rules={[{ required: true }]}
          >
            <Input type="password" />
          </Form.Item>
          <Form.Item
            name={["user", "logo"]}
            label={<label style={{ color: "white" }}>الصورة</label>}
          >
            <input
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
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              ادخال
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ margin: "0 8px" }}
              onClick={() => props.ShowAddNewShopHandler()}
            >
              الغاء
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AddShop;
