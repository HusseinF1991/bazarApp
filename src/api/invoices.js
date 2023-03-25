import { url } from "./baseUrl";
import { resources } from "../resource";

export async function getPurchasesRequests(myReqBody) {
  let output = await fetch(`${url}/getPurchasesRequests`, {
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

export async function getOnePurchaseReq(invoiceShopId) {
  let output = await fetch(`${url}/getOnePurchaseReq?invoiceShopId=${invoiceShopId}`, {
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

export async function getSellsArchive(myReqBody) {
  let output = await fetch(`${url}/getSellsArchive`, {
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
