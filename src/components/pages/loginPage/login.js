import { Form, Input, Button, Checkbox, message, Spin } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { login } from "../../../api/managers";
import { ManagerAccountInfo } from "../../../store/managerAccountInfo";

function Login() {
  const history = useHistory();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const { setAccountInfo } = ManagerAccountInfo();

  const warning = () => {
    message.warning("اسم المستخدم او الرمز السري غير صحيح");
  };

  function onFinish(values) {
    setLoadingLogin(true);
    const req = JSON.stringify({
      username: values.username,
      password: values.password,
    });
    let output = login(req);
    output.then((res) => {
      setLoadingLogin(false);
      if (res.length === 0) {
        warning();
      } else {
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("username", res[0].username);
        setAccountInfo({
          username: res[0].username,
          password: res[0].password,
          shopId: res[0].shopId,
        });

        history.push("/home");
      }
    });
  }

  const container = (
    <Form
      style={{ padding: "10px" }}
      className="rounded shadow-inner h-128 bg-white"
      name="basic"
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="اسم المستخدم"
        name="username"
        rules={[{ required: true, message: "رجاءا ادخل اسم المستخدم" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="الرمز السري"
        name="password"
        rules={[{ required: true, message: "رجاءا ادخل الرمز السري" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="remember"
        valuePropName="checked"
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Checkbox>حفظ التسجيل</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" ghost={true}>
          تسجيل
        </Button>
      </Form.Item>
    </Form>
  );

  return (
    <div
      className="absolute bg-gray-300 flex justify-center flex-wrap content-center"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Spin size="large" spinning={loadingLogin}>
        {container}
      </Spin>
    </div>
  );
}

export default Login;
