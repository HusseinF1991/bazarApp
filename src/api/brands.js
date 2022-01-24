import { url } from "./baseUrl";

export async function getBrands() {
  let output = await fetch(`${url}/getBrands`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // body: myReqBody,
  }).then((data) => {
    return data.json();
  });
  return output;
}