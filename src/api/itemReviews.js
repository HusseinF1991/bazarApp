import { url } from "./baseUrl";
import { resources } from "../resource";

export async function deleteOneReview(myReqBody) {
  let output = await fetch(`${url}/deleteOneReview`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: myReqBody,
  })
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      return resources.FAILED_TO_FETCH;
    });
  return output;
}

export async function addNewReview(myReqBody) {
  let output = await fetch(`${url}/addNewReview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: myReqBody,
  })
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      return resources.FAILED_TO_FETCH;
    });
  return output;
}

export async function setItemReviewsAsRead(itemId) {
  let output = await fetch(`${url}/setItemReviewsAsRead?itemId=${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    // body: myReqBody,
  })
    .then((data) => {
      return data.json();
    })
    .catch((err) => {
      return resources.FAILED_TO_FETCH;
    });
  return output;
}
