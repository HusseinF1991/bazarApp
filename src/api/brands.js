import { url } from "./baseUrl";
import { resources } from "../resource";

export async function getBrands() {
  let output = await fetch(`${url}/getBrands`, {
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

export async function addNewBrand(myReqBody) {
  let output = await fetch(`${url}/addNewBrand`, {
    method: "PUT",
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

export async function deleteOneBrand(brandId) {
  let output = await fetch(`${url}/deleteOneBrand?brandId=${brandId}`, {
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

export async function editBrand(myReqBody) {
  let output = await fetch(`${url}/editBrand`, {
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
