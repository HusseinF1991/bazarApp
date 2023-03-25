import { Button, Col, Form, Input, message, Modal, Row } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { editBrand } from "../../../api/brands";
import { brandImgUrl } from "../../../api/baseUrl";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";

function EditBrand(props) {
  const [form] = Form.useForm();
  const [loadingImg, setLoadingImg] = useState(false);
  const [logo, setLogo] = useState({ url: "", data: "" });
  const [selectedBrandInfo, setSelectedBrandInfo] = useState({
    id: "",
    brandName: "",
    description: "",
    brandLogo: "",
  });

  useEffect(() => {
    if (props.selectedBrandId !== undefined) {
      props.brands.forEach((brand) => {
        if (brand.id === props.selectedBrandId) {
          setSelectedBrandInfo({
            id: brand.id,
            brandName: brand.brandName,
            description: brand.description,
            brandLogo: brand.brandLogo,
          });
          setLogo({ url: `${brandImgUrl}${brand.brandLogo}`, data: "" });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFinish(event) {
    if (
      props.brands.find(
        (brand) =>
          brand.brandName === event.user.brandName.trim() &&
          brand.brandName !== selectedBrandInfo.brandName
      ) === undefined
    ) {
      let formData = new FormData();
      if (logo.data !== "") {
        formData.append("newLogo", logo.data);
        formData.append("oldLogo", selectedBrandInfo.brandLogo);
      }
      formData.append("id", selectedBrandInfo.id);
      formData.append("brandName", event.user.brandName.trim());
      formData.append("description", event.user.description);
      let output = editBrand(formData);
      output.then((result) => {
        if (result === resources.FAILED_TO_FETCH) {
          ErrorInFetch(() => onFinish(event));
        } else {
          if (result.data !== null && result.data === "successfullyAdded") {
            message.success("تم التعديل");
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

  function handleLogoInputChange(event) {
    const img = {
      url: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setLogo(img);
    setLoadingImg(false);
  }

  return (
    <Modal
      bodyStyle={{ backgroundColor: "rgb(30 41 59)" }}
      visible={true}
      centered
      title="اضافة ماركة جديدة"
      onCancel={() => props.setVisible(false)}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        onFinish={onFinish}
      >
        <Row justify="space-between" align="middle" gutter={[16, 8]}>
          <Col flex="auto">
            <Form.Item
              name={["user", "brandName"]}
              label={<label style={{ color: "white" }}>اسم الماركة</label>}
              rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              labelCol={{ span: 6 }}
              initialValue={selectedBrandInfo.brandName}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["user", "description"]}
              label={<label style={{ color: "white" }}>تفاصيل</label>}
              labelCol={{ span: 4 }}
              initialValue={selectedBrandInfo.description}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col flex="100px">
            <Form.Item
              //   name={["user", "brandLogo"]}
              label={<label style={{ color: "white" }}>الصورة</label>}
              rules={[
                {
                  validator: (_, value) =>
                    logo.url !== ""
                      ? Promise.resolve()
                      : Promise.reject(new Error("اختر صورة رجاءا")),
                },
              ]}
              labelCol={{ span: 13 }}
            >
              <input
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
                {logo.url ? (
                  <img src={logo.url} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className="mt-3 mb-0">
          <Button htmlType="submit" type="primary">
            تعديل
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditBrand;
