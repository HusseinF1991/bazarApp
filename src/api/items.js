import { url } from "./baseUrl";

export async function getItems(myReqBody) {
  let output = await fetch(`${url}/getItems`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: myReqBody,
  }).then((data) => {
    return data.json();
  });
  return output;
}

