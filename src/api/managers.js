import { url } from "./baseUrl";

export async function login(myReqBody) {
  let output = await fetch(`${url}/loginMerchant`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: myReqBody,
  }).then((data) => {
    return data.json();
  });
  return output;
}


export async function addNewManager(myReqBody){
  
  let output = await fetch(`${url}/addNewManager`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: myReqBody,
  }).then((data) => {
    return data.json();
  });
  return output;
}


export async function deleteManagerUser(myReqBody){
  
  let output = await fetch(`${url}/deleteManagerUser`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: myReqBody,
  }).then((data) => {
    return data.json();
  });
  return output;
}





export async function getUserDetails(username){
  
  let output = await fetch(`${url}/getUserDetails?username=${username}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // body: myReqBody,
  }).then((data) => {
    return data.json();
  });
  return output;
}
