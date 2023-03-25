import { Button, Result } from "antd";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MainMenuSelection } from "../../../store/mainMenuSelection";

function Unknown404() {
  const history = useHistory();
  const { setSelectedItemInfo, selectedItemInfo } = MainMenuSelection();

  //useEffect for setting selected main menu item
  useEffect(() => {
    if (selectedItemInfo !== null) {
      setSelectedItemInfo({
        key: null,
        title: null,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onBackClicked() {
    history.goBack();
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="الموقع المدخل غير موجود"
      extra={
        <Button type="primary" ghost={true} onClick={onBackClicked}>
          رجوع
        </Button>
      }
    />
  );
}

export default Unknown404;
