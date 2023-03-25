import { Button, Form, Input, message } from "antd";
import { addNewManager } from "../../../api/managers";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";

function AddManagerUser(props) {

  function onFinish(event) {
    const myReqBody = {
      username: event.username,
      password: event.password,
      shopId: props.shopId,
    };
    let output = addNewManager(JSON.stringify(myReqBody));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onFinish(event));
      } else {
        if (res.err === "usernameDuplicated") {
          message.error("اسم المستخدم موجود مسبقا");
        } else {
          message.success("تم اضافة مستخدم جديد");
          props.setTblHasData(!props.tblHasData);
          props.ShowAddNewManagerHandler();
        }
      }
    });
  }

  return (
    <div
      className="absolute inset-0 w-full h-full z-10"
      style={{ backgroundColor: "rgba(100, 116, 139, 0.85)" }}
    >
      <div className="m-auto w-6/12 bg-slate-800 mt-8 p-4">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout={"horizontal"}
          initialValues={{ layout: "horizontal" }}
          onFinish={onFinish}
        >
          <Form.Item
            label={<label style={{ color: "white" }}>اسم المستخدم</label>}
            name={"username"}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<label style={{ color: "white" }}>الرمز السري</label>}
            name={"password"}
            rules={[{ required: true }]}
          >
            <Input placeholder="password" type="password" />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 14, offset: 4 }}>
            <Button type="primary" htmlType="submit">
              اضافة
            </Button>
            <Button
              type="primary"
              style={{ margin: "0 8px" }}
              onClick={() => props.ShowAddNewManagerHandler()}
            >
              الغاء
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AddManagerUser;
