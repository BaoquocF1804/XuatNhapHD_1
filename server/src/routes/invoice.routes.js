const InvoiceController = require("../controllers/InvoiceController");

const router = require("express").Router();

// [POST] create invoice
router.post("/post", InvoiceController.createInvoice);
router.get("/get", InvoiceController.getInvoices);
router.get("/get_by_person_id", InvoiceController.getInvoicesOfId);
router.get("/get_with_query", InvoiceController.getInvoicesWithQuery);
router.put("/change_invoice_info", InvoiceController.changeInvoiceInfo);
module.exports = router;
