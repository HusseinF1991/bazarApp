import { url } from "./baseUrl";
import { resources } from "../resource";

export async function getItems(myReqBody) {
  let output = await fetch(`${url}/getItems`, {
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

export async function getOneItemDetails(id) {
  let output = await fetch(`${url}/getOneItemDetails?id=${id}`, {
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

export async function addNewItem(myReqBody) {
  let output = await fetch(`${url}/addNewItem`, {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
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

export async function modifyItem(myReqBody) {
  let output = await fetch(`${url}/modifyItem`, {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
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

export async function deleteOneItem(itemId) {
  let output = await fetch(`${url}/deleteOneItem?itemId=${itemId}`, {
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
