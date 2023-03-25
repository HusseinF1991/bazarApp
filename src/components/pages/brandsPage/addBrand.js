import { Button, Col, Form, Input, message, Modal, Row, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { addNewBrand } from "../../../api/brands";
import ImgCrop from "antd-img-crop";
import Text from "antd/lib/typography/Text";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";

function AddBrand(props) {
  const [form] = Form.useForm();
  //   const [loadingImg, setLoadingImg] = useState(false);
  const [fileList, setFileList] = useState([{ uid: "", url: "", data: "" }]);

  function onFinish(event) {
    if (
      props.brands.find(
        (brand) => brand.brandName === event.user.brandName.trim()
      ) === undefined
    ) {
      let formData = new FormData();
      formData.append("brandLogo", fileList[0].data);
      formData.append("brandName", event.user.brandName.trim());
      formData.append("description", event.user.description);
      let output = addNewBrand(formData);
      output.then((result) => {
        if (result === resources.FAILED_TO_FETCH) {
          ErrorInFetch(() => onFinish(event));
        } else {
          if (result.data !== null && result.data === "successfullyAdded") {
            message.success("تم اضافة ماركة جديدة بنجاح");
            props.setLoadBrands(true);
            props.setVisible(false);
          } else {
            message.error("حدث خطأ");
          }
        }
      });
    } else {
      message.error("اسم الماركة موجودة مسبقا");
    }
  }

  //   const uploadButton = (
  //     <div>
  //       {loadingImg ? (
  //         <LoadingOutlined style={{ color: "white" }} />
  //       ) : (
  //         <PlusOutlined style={{ color: "white" }} />
  //       )}
  //       <div style={{ marginTop: 8, color: "white" }}>اختر الصورة</div>
  //     </div>
  //   );

  //   function handleLogoInputChange(event) {
  //     const img = {
  //       preview: URL.createObjectURL(event.target.files[0]),
  //       data: event.target.files[0],
  //     };
  //     setFileList(img);
  //     setLoadingImg(false);
  //   }

  const beforeUpload = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFileList([{ uid: file.uid, url: reader.result, data: file }]);
    };

    // then upload `file` from the argument manually
    return false;
  };

  const handlePreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const handleRemove = (file) => {
    setFileList([{ uid: "", url: "", data: "" }]);
  };

  return (
    <Modal
      bodyStyle={{ backgroundColor: "rgb(30 41 59)" }}
      visible={props.visible}
      centered
      title="اضافة ماركة جديدة"
      onCancel={() => props.setVisible(false)}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
        onFinish={onFinish}
        // wrapperCol={{ span: 12 }}
      >
        <Row justify="space-between" align="middle" gutter={[16, 8]}>
          <Col flex="auto">
            <Form.Item
              name={["user", "brandName"]}
              label={<label style={{ color: "white" }}>اسم الماركة</label>}
              rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              labelCol={{ span: 6 }}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "description"]}
              label={<label style={{ color: "white" }}>تفاصيل</label>}
              labelCol={{ span: 4 }}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col flex="100px">
            <Form.Item
              name={["user", "brandLogo"]}
              label={<label style={{ color: "white" }}>الصورة</label>}
              //   rules={[{ required: true, message: "اختر صورة رجاءا" }]}
              rules={[
                {
                  validator: (_, value) =>
                    fileList[0].url !== ""
                      ? Promise.resolve()
                      : Promise.reject(new Error("اختر صورة رجاءا")),
                },
              ]}
              labelCol={{ span: 13 }}
            >
              <ImgCrop
                style={{ backgroundColor: "rgb(30 41 59)" }}
                grid
                rotate
                modalOk="موافق"
                modalCancel="الغاء"
                modalTitle="X"
              >
                <Upload
                  accept="image/png, image/jpeg"
                  listType="picture-card"
                  //   onChange={handleChange}
                  onRemove={handleRemove}
                  onPreview={handlePreview}
                  maxCount={0}
                  beforeUpload={beforeUpload}
                >
                  {fileList[0].url === "" && (
                    <div>
                      <Text type="secondary">
                        <PlusOutlined />
                      </Text>
                      <div style={{ marginTop: 8 }}>
                        <Text type="secondary">اختر الصورة</Text>
                      </div>
                    </div>
                  )}
                </Upload>
              </ImgCrop>
              {/* <input
                type="file"
                style={{ display: "none" }}
                id="brandLogoInput"
                onChange={handleLogoInputChange}
              />
                <Button
                  onClick={() =>
                    document.getElementById("brandLogoInput").click()
                  }
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
          </Col>
        </Row>
        <Form.Item className="mt-3 mb-0">
          <Button
            htmlType="submit"
            // loading={submitting}
            type="primary"
          >
            اضافة
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddBrand;
