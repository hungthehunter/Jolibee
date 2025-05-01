
// src/utils/toastify.js
import { toast } from "react-toastify";

const toastSuccess = (msg) => toast.success(msg);
 const toastError = (msg) => toast.error(msg);
 const toastWarning = (msg) => toast.warning(msg);
 const toastInfo = (msg) => toast.info(msg);


export { toastError, toastInfo, toastSuccess, toastWarning };

