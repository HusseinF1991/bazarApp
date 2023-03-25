import { url } from "./baseUrl";
import { resources } from "../resource";

export async function modifyItemTypeMainInfo(myReqBody) {
  let output = await fetch(`${url}/modifyItemTypeMainInfo`, {
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

export async function deleteOneItemType(typeId) {
  let output = await fetch(`${url}/deleteOneItemType?typeId=${typeId}`, {
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
