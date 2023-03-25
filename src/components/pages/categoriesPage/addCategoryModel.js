import { Form, Input, message, Modal } from "antd";
import { addNewCategory } from "../../../api/categories";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";

function AddCategoryModel(props) {
  const [form] = Form.useForm();
  function isModalVisible() {}

  function handleOk(e) {
    if (
      props.categoriesData.find(
        (element) =>
          props.selectedNode.level === element.catLevel &&
          e.categoryName === element.catName
      ) !== undefined
    ) {
      message.error("اسم الصنف موجود مسبقا في هذا المستوى");
      return;
    } else {
      const myReqBody = {
        catName: e.categoryName,
        catLevel: props.selectedNode.level,
        parentCatId: props.selectedNode.parentId,
      };
      let output = addNewCategory(JSON.stringify(myReqBody));
      output.then((res) => {
        if (res === resources.FAILED_TO_FETCH) {
          ErrorInFetch(() => handleOk(e));
        } else {
          if (res.id !== null) {
            props.setLoadCategories(true);
          }
        }
      });
    }

    props.setDisplayAddCatModel(false);
  }

  function handleCancel() {
    props.setDisplayAddCatModel(false);
  }

  return (
    <div>
      <Modal
        title="اضافة صنف"
        visible={isModalVisible}
        onOk={form.submit}
        okType={"primary"}
        onCancel={handleCancel}
        closable={false}
        okButtonProps={{ ghost: true }}
      >
        <Form
          form={form}
          onFinish={handleOk}
          validateMessages={{
            required: "املاء الحقل رجاءا",
          }}
        >
          <Form.Item name={["categoryName"]} rules={[{ required: true }]}>
            <Input placeholder="اسم الصنف الجديد" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddCategoryModel;
