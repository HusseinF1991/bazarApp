import { Modal, Result } from "antd";

function ErrorInFetch(reloadFetchFunction) {
  Modal.confirm({
    centered: "true",
    okText: "اعادة المحاولة",
    cancelText: "الغاء",
    icon: null,
    onOk() {
      if (reloadFetchFunction !== undefined && reloadFetchFunction !== null)
        reloadFetchFunction();
    },
    onCancel() {
      // console.log("Cancel");
    },
    content: (
      <Result
        status="500"
        title="500"
        subTitle="حدث خطأ في الربط مع الخادم تاكد من الاتصال بالانترنت او اتصل بالمسؤول الفني للموقع"
        // extra={<Button type="primary">اعادة المحاولة</Button>}
      />
    ),
  });
}

export default ErrorInFetch;
