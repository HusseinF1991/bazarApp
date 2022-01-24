import React, { useEffect, useState } from "react";
import { Button, message, Popconfirm, Space, Tooltip, Tree } from "antd";
import {
  CaretLeftOutlined,
  DeleteTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import { render } from "@testing-library/react";
import { deleteCategory, getCategories } from "../../../api/categories";
import AddCategoryModel from "./addCategoryModel";

const initTreeData = [
  //   {
  //     title: "Expand to load",
  //     key: "0",
  //   },
  //   {
  //     title: "Expand to load",
  //     key: "1",
  //   },
  {
    title: "اضافة",
    key: "0",
    parentId: null,
    level: 1,
    isLeaf: true,
  },
]; // It's just a simple demo. You can use tree map to optimize update perf.

function Categories() {
  const [treeData, setTreeData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [displayAddCatModel, setDisplayAddCatModel] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loadCategories, setLoadCategories] = useState(true);
  const [loadedKeys, setLoadedKeys] = useState([]);

  useEffect(() => {
    let output = getCategories();
    let level1CatTree = [];
    let keyCount = 0;
    output.then((res) => {
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
      console.log("level1CatTree = ", level1CatTree);
      setCategoriesData(res);
      setLoadedKeys([]);
      setTreeData(level1CatTree);
      setLoadCategories(false);
      // setTreeData((origin) =>
      //   updateTreeData(origin, origin[0].key, level1CatTree)
      // );
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
      console.log("treeData = ", treeData);
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
    console.log(item);
    if (categoriesData.find((i) => i.parentCatId === item.id) !== undefined) {
      message.error("لا يمكن الحذف , هذا الصنف لديه اصناف تحته");
      return;
    }
    let output = deleteCategory(JSON.stringify({ id: item.id }));
    output.then((res) => {
      console.log(res);
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
