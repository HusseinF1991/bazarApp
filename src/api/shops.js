import {url} from "./baseUrl";

export async function getAllShops() {
  let output = await fetch(`${url}/getAllShops`, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    // body: JSON.stringify(data) // body data type must match "Content-Type" header
  })
  .then((response) => {
      return response.json()
  });
  return output;
}

export async function getOneShopDetails(myReqBody) {
  let output = await fetch(`${url}/getOneShopDetails`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: myReqBody // body data type must match "Content-Type" header
  })
  .then((response) => {
      return response.json()
  });
  return output;
}

export async function addNewShop(myReqBody) {
  let output = await fetch(`${url}/addNewShop`, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    // headers: {
    //   "Content-Type": "application/json",
    //   // 'Content-Type': 'application/x-www-form-urlencoded',
    // },
     body: myReqBody, // body data type must match "Content-Type" header
  })
  .then((response) => {
      return response.json()
  });
  return output;
}
