import { Table, Input, Button, Space, Typography, Modal, message } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { deleteOneBrand, getBrands } from "../../../api/brands";
import AddBrand from "./addBrand";
import { brandImgUrl } from "../../../api/baseUrl";
import EditBrand from "./editBrand";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";
import { MainMenuSelection } from "../../../store/mainMenuSelection";

const { confirm } = Modal;

let searchInput;
let selectedBrandId;
function Brands() {
  const [brands, setBrands] = useState([]);
  const [loadBrands, setLoadBrands] = useState(true);
  const [visibleAddBrand, setVisibleAddBrand] = useState(false);
  const [visibleEditBrand, setVisibleEditBrand] = useState(false);
  const [myState, setMyState] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const { setSelectedItemInfo } = MainMenuSelection();

    
  //useEffect for setting selected main menu item
  useEffect(() => {
    setSelectedItemInfo({
      key: resources.MAIN_MENU_ITEMS.BRANDS.KEY,
      title: resources.MAIN_MENU_ITEMS.BRANDS.TITLE,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    let output = getBrands();
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => setLoadBrands(!loadBrands));
      } else {
        if (res.length > 0) {
          let brandsArr = [];
          res.forEach((element) => {
            let brand = {
              key: res.indexOf(element),
              ...element,
            };
            brandsArr.push(brand);
          });
          setBrands(brandsArr);
          setLoadBrands(false);
        }
      }
    });
  }, [loadBrands]);

  const getColumnSearchProps = (colTitle, dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`بحث ${colTitle}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setMyState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            تطبيق
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            تفريغ
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            ghost={true}
            size="small"
            style={{ width: 90 }}
          >
            بحث
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      myState.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[myState.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setMyState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setMyState({ searchText: "" });
  };

  const columns = [
    {
      title: "#",
      dataIndex: "sequence",
      key: "sequence",
      align: "right",
      width: "8%",
      //   sorter: (a, b) => a.address.length - b.address.length,
      //   sortDirections: ["descend", "ascend"],
    },
    {
      title: "الماركة",
      dataIndex: "brandName",
      key: "brandName",
      align: "right",
      //   width: "20%",
      ...getColumnSearchProps("الماركة", "brandName"),
      //   sorter: (a, b) => a.address.length - b.address.length,
      //   sortDirections: ["descend", "ascend"],
    },
    {
      title: "تفاصيل",
      dataIndex: "description",
      key: "description",
      align: "right",
      width: "30%",
    },
    {
      title: "صورة الماركة",
      dataIndex: "brandLogo",
      key: "brandLogo",
      align: "right",
      width: "15%",
      render: (_, record) => (
        <img
          src={
            record.brandLogo !== null
              ? `${brandImgUrl}${record.brandLogo}`
              : null
          }
          alt="avatar"
          style={{ width: "50px" }}
        />
      ),
    },
    {
      title: "العمليات",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (_, record) => {
        return (
          <>
            <Typography.Link
              onClick={() => {
                selectedBrandId = record.id;
                OnEditBrandClickHandler();
              }}
            >
              تعديل
            </Typography.Link>

            <Button
              type="link"
              size="default"
              onClick={() => onDeleteBrandHandler(record)}
            >
              {" "}
              حذف{" "}
            </Button>
          </>
        );
      },
    },
  ];

  function onAddBrandClickHandler() {
    setVisibleAddBrand(!visibleAddBrand);
  }

  function OnEditBrandClickHandler() {
    setVisibleEditBrand(!visibleEditBrand);
  }

  function onDeleteBrandHandler(brandRecord) {
    confirm({
      title: "هل انت متاكد من حذف النوع هذا؟",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: "نعم",
      okType: "danger",
      cancelText: "كلا",
      onOk() {
        onDeleteBrand(brandRecord);
      },
      onCancel() {
        // console.log("Cancel");
      },
    });
  }

  function onDeleteBrand(brandRecord) {
    const key = "updatable";
    message.loading({ content: "جاري الحذف", key });
    let output = deleteOneBrand(brandRecord.id);
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onDeleteBrand(brandRecord));
      } else {
        if (res.deleted !== undefined) {
          setLoadBrands(true);
          setTimeout(() => {
            message.success({ content: "تم الحذف", key, duration: 1 });
          }, 1000);
        } else {
          message.error("حدث خطأ في عملية الحذف");
        }
      }
    });
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={brands}
        footer={() => (
          <Button onClick={onAddBrandClickHandler}>اضافة ماركة</Button>
        )}
        pagination={false}
      />
      <AddBrand
        setVisible={setVisibleAddBrand}
        visible={visibleAddBrand}
        setLoadBrands={setLoadBrands}
        brands={brands}
      />
      {visibleEditBrand ? (
        <EditBrand
          setVisible={setVisibleEditBrand}
          visible={visibleEditBrand}
          setLoadBrands={setLoadBrands}
          brands={brands}
          selectedBrandId={selectedBrandId}
        />
      ) : null}
    </>
  );
}

export default Brands;
