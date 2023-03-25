import { url } from "./baseUrl";
import { resources } from "../resource";

export async function getInvoiceShopChat(id) {
  let output = await fetch(`${url}/getInvoiceShopChat?id=${id}`, {
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

export async function addNewMsgToChat(myReqBody) {
  let output = await fetch(`${url}/addNewMsgToChat`, {
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
