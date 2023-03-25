import {
  Avatar,
  Button,
  Comment,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Rate,
  Spin,
  Tooltip,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { UserOutlined, DeleteFilled } from "@ant-design/icons";
import moment from "moment";
import { useState, useEffect } from "react";
import back_direction from "../../../images/back_direction.png";
import {
  addNewReview,
  deleteOneReview,
  setItemReviewsAsRead,
} from "../../../api/itemReviews";
import { resources } from "../../../resource";
import ErrorInFetch from "../../layout/errorInFetch";

function ItemReviews(props) {
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [visible, setVisible] = useState(false); //for model of adding comment

  useEffect(() => {
    function setAsRead() {
      let output = setItemReviewsAsRead(props.selectedItemId);
      output.then((res) => {
        if (res === resources.FAILED_TO_FETCH) {
          ErrorInFetch(() => setAsRead());
        }
      });
    }
    setAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function OnDeleteReviewClickHandler(review) {
    setLoadingSpin(true);
    const myReqBody = { id: review.id };
    let output = deleteOneReview(JSON.stringify(myReqBody));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        setLoadingSpin(false);
        ErrorInFetch(() => OnDeleteReviewClickHandler(review));
      } else {
        if (res.deleted !== null) {
          const newReviewsArr = props.itemReviews.reviews.filter(
            (element) => element.id !== review.id
          );

          let ratesSummation = 0;
          newReviewsArr.forEach((element) => {
            ratesSummation = ratesSummation + element.rate;
          });
          const itemRate = ratesSummation / newReviewsArr.length;

          props.setItemReviews({ reviews: newReviewsArr, rate: itemRate });
          setLoadingSpin(false);
        }
      }
    });
  }

  function onSubmitCommentHandler(event) {
    setVisible(false);
    setLoadingSpin(true);

    const myReqBody = {
      itemId: props.selectedItemId,
      reviewerName: event.user.reviewerName,
      title: event.user.title,
      body: event.user.body,
      rate: event.user.rate,
      readByManager: 1,
    };
    let output = addNewReview(JSON.stringify(myReqBody));
    output.then((res) => {
      if (res === resources.FAILED_TO_FETCH) {
        setLoadingSpin(false);
        ErrorInFetch(() => onSubmitCommentHandler(event));
      } else {
        let ratesSummation = 0;
        props.itemReviews.reviews.forEach((element) => {
          ratesSummation = ratesSummation + element.rate;
        });
        const itemRate =
          (ratesSummation + res.rate) / (props.itemReviews.reviews.length + 1);
        props.setItemReviews({
          reviews: [...props.itemReviews.reviews, res],
          rate: itemRate,
        });

        setLoadingSpin(false);
      }
    });
  }

  return (
    <div
      className="absolute inset-0 w-full h-full z-10"
      style={{ backgroundColor: "rgba(100, 116, 139, 0.85)" }}
    >
      <div
        className="m-auto h-5/6 w-6/12 bg-slate-800 mt-8 p-4"
        // style={{ overflowY: "scroll" }}
      >
        <div className="flex justify-end mb-2">
          <Tooltip placement="right" title={"رجوع"}>
            <img
              src={back_direction}
              alt="back_direction"
              style={{ width: "35px", cursor: "pointer" }}
              className="bg-slate-400 hover:bg-slate-100 p-0.5 rounded-sm pl-2 pr-2"
              onClick={props.onItemReviewsClickHandler}
            ></img>
          </Tooltip>
        </div>
        <Spin spinning={loadingSpin}>
          <List
            className="comment-list"
            style={{
              height: 470,
              overflowY: "auto",
            }}
            header={`${props.itemReviews.reviews.length} تعليقات`}
            itemLayout="horizontal"
            dataSource={props.itemReviews.reviews}
            renderItem={(item) => (
              <li key={props.itemReviews.reviews.id}>
                <Comment
                  className="bg-neutral-50 mt-2 rounded  ml-5 mr-5"
                  actions={[
                    <div>
                      <Popconfirm
                        title="سيتم الحذف نهائيا , هل انت متاكد؟"
                        onConfirm={() => OnDeleteReviewClickHandler(item)}
                        okText="نعم"
                        cancelText="كلا"
                      >
                        <Tooltip title="حذف التعليق">
                          <DeleteFilled />
                        </Tooltip>
                      </Popconfirm>
                    </div>,
                  ]}
                  author={item.reviewerName}
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: "#8d0768",
                      }}
                      icon={<UserOutlined />}
                    />
                  }
                  content={
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p>{item.body}</p>
                    </div>
                  }
                  datetime={
                    <Tooltip
                      title={moment(new Date(item.updatedAt)).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    >
                      <span>{moment(new Date(item.updatedAt)).fromNow()}</span>
                    </Tooltip>
                  }
                />
              </li>
            )}
          />
          <div className="flex justify-end">
            <Button type="primary" onClick={() => setVisible(true)}>
              اضافة تعليق
            </Button>
          </div>
          <Modal
            bodyStyle={{ backgroundColor: "rgb(30 41 59)" }}
            //   className="bg-zinc-400"
            title="اضافة نقد"
            centered
            visible={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            width={800}
            footer={null}
          >
            <Form onFinish={onSubmitCommentHandler}>
              <Form.Item
                name={["user", "reviewerName"]}
                className="mt-5 mb-1"
                rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              >
                <Input placeholder="الاسم الحقيقي او المستعار" />
              </Form.Item>
              <Form.Item
                name={["user", "title"]}
                className="mt-5 mb-1"
                rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              >
                <Input placeholder="عنوان النقد" />
              </Form.Item>
              <Form.Item
                className="mt-0 mb-1"
                name={["user", "body"]}
                rules={[{ required: true, message: "املأ الحقل رجاءا" }]}
              >
                <TextArea rows={2} placeholder="محتوى النقد" />
              </Form.Item>
              <Form.Item name={["user", "rate"]}>
                <Rate className="flex justify-start" value={0} />
              </Form.Item>
              <Form.Item className="mt-3">
                <Button
                  htmlType="submit"
                  // loading={submitting}
                  type="primary"
                >
                  موافق
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </Spin>
      </div>
    </div>
  );
}

export default ItemReviews;
