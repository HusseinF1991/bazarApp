import { useEffect } from "react";
import welcome_bg from "../../../images/welcome_bg.jpg";
import { MainMenuSelection } from "../../../store/mainMenuSelection";

function Home() {
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

  return (
    <div className="flex justify-center">
      <img src={welcome_bg} alt="img" className="w-7/12 h-8/12"></img>
    </div>
  );
}

export default Home;
