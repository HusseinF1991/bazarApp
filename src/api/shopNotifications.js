import { url } from "./baseUrl";
import { resources } from "../resource";

export async function getShopNotifications(shopId) {
  let output = await fetch(`${url}/getShopNotifications?shopId=${shopId}`, {
    method: "GET",
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

export async function deleteOneNotification(id) {
  let output = await fetch(`${url}/deleteOneNotification?id=${id}`, {
    method: "DELETE",
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