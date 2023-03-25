import { url } from "./baseUrl";
import { resources } from "../resource";

export async function UpdateInInvoiceShops(myReqBody) {
  let output = await fetch(`${url}/updateInInvoiceShops`, {
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
