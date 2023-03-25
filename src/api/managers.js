import { resources } from "../resource";
import { url } from "./baseUrl";

export async function login(myReqBody) {
  let output = await fetch(`${url}/loginMerchant`, {
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

export async function addNewManager(myReqBody) {
  let output = await fetch(`${url}/addNewManager`, {
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

export async function deleteManagerUser(myReqBody) {
  let output = await fetch(`${url}/deleteManagerUser`, {
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

export async function getUserDetails(token) {
  let output = await fetch(`${url}/getUserDetails`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "authorization": `bearer ${token}`,
    },
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

export async function setManagerToken(myReqBody) {
  let output = await fetch(`${url}/setManagerToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    //   "authorization": `bearer ${token}`,
    },
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
