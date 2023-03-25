import { Form, Input, Button, Checkbox, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { login } from "../../../api/managers";
import { resources } from "../../../resource";
import { MainMenuSelection } from "../../../store/mainMenuSelection";
import { ManagerAccountInfo } from "../../../store/managerAccountInfo";
import ErrorInFetch from "../../layout/errorInFetch";

function Login() {
  const history = useHistory();
  const [loadingLogin, setLoadingLogin] = useState(false);
  const { setAccountInfo } = ManagerAccountInfo();
  const { setSelectedItemInfo, selectedItemInfo } = MainMenuSelection();

  //useEffect for setting selected main menu item
  useEffect(() => {
    if (selectedItemInfo.key !== null) {
      setSelectedItemInfo({
        key: null,
        title: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      if (res === resources.ERRORS.FAILED_TO_FETCH) {
        setLoadingLogin(false);
        ErrorInFetch(() => onFinish(values));
      } else {
        setLoadingLogin(false);
        if (
          res.ERROR === resources.ERRORS.USER_NOT_AUTHORIZED.ERROR &&
          res.ERROR_TYPE === resources.ERRORS.USER_NOT_AUTHORIZED.ERROR_TYPE
        ) {
          warning();
        } else {
          if (values.remember === true) {
            sessionStorage.setItem(resources.SESSION_STORAGE.TOKEN, res.token);
          }
          setAccountInfo({
            managerId: res.manager[0].id,
            username: res.manager[0].username,
            password: res.manager[0].password,
            shopId: res.manager[0].shopId,
            shopLogo:
              res.manager[0].Shop !== null ? res.manager[0].Shop.logo : null,
            shopName:
              res.manager[0].Shop !== null ? res.manager[0].Shop.name : null,
            token: res.manager[0].token,
          });

          history.push(resources.ROUTES.HOME);
        }
      }
    });
  }

  return (
    <Spin size="large" spinning={loadingLogin}>
      <div
        className="grid justify-items-center bg-slate-100"
        style={{
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="rounded shadow-2xl h-2/5 w-5/12  self-center bg-white p-4">
          <Form
            style={{ padding: "10px" }}
            name="basic"
            labelCol={{ offset: 0, span: 6 }}
            wrapperCol={{ span: 14 }}
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

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>حفظ التسجيل</Checkbox>
            </Form.Item>

            <Form.Item className="mt-10">
              <Button type="primary" htmlType="submit" ghost={true}>
                تسجيل
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Spin>
  );
}

export default Login;
