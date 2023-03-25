import React, { useEffect, useState } from "react";
import { Button, message, Popconfirm, Space, Tree } from "antd";
import { CaretLeftOutlined, DeleteTwoTone } from "@ant-design/icons";
import { deleteCategory, getCategories } from "../../../api/categories";
import AddCategoryModel from "./addCategoryModel";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";
import { MainMenuSelection } from "../../../store/mainMenuSelection";

function Categories() {
  const [treeData, setTreeData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [displayAddCatModel, setDisplayAddCatModel] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loadCategories, setLoadCategories] = useState(true);
  const [loadedKeys, setLoadedKeys] = useState([]);
  const { setSelectedItemInfo } = MainMenuSelection();

  //useEffect for setting selected main menu item
  useEffect(() => {
    setSelectedItemInfo({
      key: resources.MAIN_MENU_ITEMS.CATEGORIES.KEY,
      title: resources.MAIN_MENU_ITEMS.CATEGORIES.TITLE,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let output = getCategories();
    let level1CatTree = [];
    let keyCount = 0;
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => setLoadCategories(!loadCategories));
      } else {
        if (res.length > 0) {
          res.forEach((element) => {
            if (element.catLevel === 1) {
              const branch = {
                key: keyCount.toString(),
                id: element.id,
                title: element.catName,
                level: element.catLevel,
                parentId: null,
                isLeaf: false,
              };
              level1CatTree.push(branch);
              keyCount++;
            }
          });
        }
        level1CatTree.push({
          title: "اضافة",
          key: keyCount.toString(),
          parentId: null,
          level: 1,
          isLeaf: true,
        });
        setCategoriesData(res);
        setLoadedKeys([]);
        setTreeData(level1CatTree);
        setLoadCategories(false);
      }
    });
  }, [loadCategories]);

  function addNewCategoryHandler(item) {
    setSelectedNode(item);
    setDisplayAddCatModel(!displayAddCatModel);
  }

  const onLoadData = (node) =>
    new Promise((resolve) => {
      if (node.children) {
        resolve();
        return;
      }

      let loadedLvlCatTree = [];
      let keyCount = 0;
      categoriesData.forEach((element) => {
        if (
          element.catLevel === node.level + 1 &&
          element.parentCatId === node.id
        ) {
          const branch = {
            key: `${node.key}-${keyCount.toString()}`,
            id: element.id,
            title: element.catName,
            level: element.catLevel,
            parentId: node.id,
            isLeaf: false,
          };
          loadedLvlCatTree.push(branch);
          keyCount++;
        }
      });
      loadedLvlCatTree.push({
        title: "اضافة",
        key: `${node.key}-${keyCount.toString()}`,
        parentId: node.id,
        level: node.level + 1,
        isLeaf: true,
      });
      setTimeout(() => {
        setTreeData((origin) =>
          updateTreeData(origin, node.key, loadedLvlCatTree)
        );
        resolve();
      }, 500);
    });

  const renderTitle = (item) =>
    !item.isLeaf ? (
      <Space size="middle">
        {item.title}
        {/* <Tooltip placement="topLeft" title="اضافة صنف تحت هذا الصنف">
          <PlusOutlined onClick={() => console.log(item.key)} />
        </Tooltip> */}

        {/* <Tooltip placement="topLeft" title="حذف"> */}
        <Popconfirm
          title="هل انت متأكد من الحذف؟"
          onConfirm={() => onDeletingCategoryHandler(item)}
          // onCancel={}
          okText="نعم"
          cancelText="كلا"
          okButtonProps={{ danger: true }}
        >
          <DeleteTwoTone />
        </Popconfirm>
        {/* </Tooltip> */}
      </Space>
    ) : (
      <Button onClick={() => addNewCategoryHandler(item)}>{"اضافة صنف"}</Button>
      // <Space onClick={}>
      //   <PlusOutlined />
      //   {"اضافة صنف"}
      // </Space>
    );

  function updateTreeData(list, key, children) {
    return list.map((node) => {
      if (node.key === key) {
        return { ...node, children };
      }
      // console.log(list);

      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }

      return node;
    });
  }

  function onDeletingCategoryHandler(item) {
    if (categoriesData.find((i) => i.parentCatId === item.id) !== undefined) {
      message.error("لا يمكن الحذف , هذا الصنف لديه اصناف تحته");
      return;
    }
    let output = deleteCategory(JSON.stringify({ id: item.id }));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        ErrorInFetch(() => onDeletingCategoryHandler(item));
      } else {
        if (
          res.err !== null &&
          res.err === "SequelizeForeignKeyConstraintError"
        ) {
          message.error("لا يمكن حذف صنف و يوجد مواد مصنفه به");
        } else if (res.deleted !== null) {
          message.success("تم الحذف");
          setLoadCategories(true);
        } else {
          message.error("حدث خطأ بعملية الحذف");
        }
      }
    });
  }

  return (
    <Space>
      <Tree
        loadData={onLoadData}
        treeData={treeData}
        onSelect={(selectedKeys) => console.log(selectedKeys)}
        switcherIcon={<CaretLeftOutlined />}
        titleRender={renderTitle}
        selectable={false}
        showLine={true}
        onLoad={(loadedKeys) => setLoadedKeys(loadedKeys)}
        loadedKeys={loadedKeys}
        //   virtual={true}
        //   draggable
      />
      {displayAddCatModel ? (
        <AddCategoryModel
          setDisplayAddCatModel={setDisplayAddCatModel}
          categoriesData={categoriesData}
          setLoadCategories={setLoadCategories}
          selectedNode={selectedNode}
        />
      ) : null}
    </Space>
  );
}

export default Categories;
