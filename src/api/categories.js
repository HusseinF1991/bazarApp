import { url } from "./baseUrl";

export async function getCategories() {
  let output = await fetch(`${url}/getCategories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // body: myReqBody,
  }).then((data) => {
    return data.json();
  });
  return output;
}




export async function addNewCategory(myReqBody) {
    let output = await fetch(`${url}/addNewCategory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: myReqBody,
    }).then((data) => {
      return data.json();
    });
    return output;
  }

  

export async function deleteCategory(myReqBody) {
  let output = await fetch(`${url}/deleteCategory`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: myReqBody,
  }).then((data) => {
    return data.json();
  });
  return output;
}
