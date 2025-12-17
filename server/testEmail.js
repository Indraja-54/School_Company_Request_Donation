import dotenv from "dotenv";
dotenv.config();
import { sendEmail } from "./util/sendEmail.js";

sendEmail(
  "indraja@gmail.com",
  "Test Mail",
  "If you got this, email works!"
)
.then(() => console.log("Mail sent"))
.catch(console.error);
