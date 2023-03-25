import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { editShopInfo } from "../../../api/shops";
import { useEffect } from "react/cjs/react.development";
import { shopImgUrl } from "../../../api/baseUrl";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";

function EditShopInfo(props) {
  const [loadingImg, setLoadingImg] = useState(false);
  const [logo, setLogo] = useState("");
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => {
    setLogo(props.shopData.logo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFinish(values){
    let formData = new FormData();
    if (logo.data !== undefined) {
      formData.append("newLogo", logo.data);
      formData.append("oldLogo", props.shopData.logo);
    }
    formData.append("id", props.shopData.id);
    formData.append("name", values.user.name.trim());
    formData.append("location", values.user.location.trim());
    formData.append("specialty", values.user.specialty.trim());
    formData.append("email", values.user.email);
    formData.append("mobile", values.user.mobile);
    formData.append("profitRate", values.user.profitRate);

    
    let output = editShopInfo(formData);
    output.then((result) => {
      if (result === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() =>  onFinish(values));
      } else {
        if (result.err !== null && result.err === "shopNameDuplicated") {
          message.error("اسم المحل موجود مسبقا");
        } else if (
          result.data !== null &&
          result.data === "successfullyAdded"
        ) {
          message.success("تم تعديل المعلومات");
          props.setTblHasData(!props.tblHasData);
          props.onEditShopInfoClickHandler();
        }
      }
    });
  };

  function handleLogoInputChange(event) {
    let img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setLogo(img);
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

  return (
    <div
      className="absolute inset-0 w-full h-full z-10"
      style={{ backgroundColor: "rgba(100, 116, 139, 0.85)" }}
    >
      <div className="m-auto w-6/12 bg-slate-800 mt-8 p-4">
        <Form {...layout} name="nest-messages" onFinish={onFinish}>
          <Form.Item
            label={<label style={{ color: "white" }}>اسم المحل</label>}
            name={["user", "name"]}
            rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
            initialValue={props.shopData.name}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "specialty"]}
            label={<label style={{ color: "white" }}>التخصص</label>}
            rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
            initialValue={props.shopData.specialty}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "email"]}
            label={<label style={{ color: "white" }}>ايميل</label>}
            rules={[{ type: "email", min: 0, max: 99 }]}
            initialValue={props.shopData.email}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "mobile"]}
            label={<label style={{ color: "white" }}>رقم الهاتف</label>}
            rules={[{ type: "number", len: 11 }]}
            initialValue={props.shopData.mobile}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "location"]}
            label={<label style={{ color: "white" }}>الموقع</label>}
            rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
            initialValue={props.shopData.location}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "profitRate"]}
            label={<label style={{ color: "white" }}>نسبة الربح</label>}
            initialValue={props.shopData.profitRate}
          >
            <Input />
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
              {logo !== "" ? (
                <img
                  src={
                    logo.preview === undefined
                      ? `${shopImgUrl}${logo}`
                      : logo.preview
                  }
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
              onClick={() => props.onEditShopInfoClickHandler()}
            >
              الغاء
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default EditShopInfo;
