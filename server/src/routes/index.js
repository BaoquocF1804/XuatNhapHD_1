const personRouter = require("./person.routes");
const invoiceRouter = require("./invoice.routes");
function route(app) {
  app.use("/person", personRouter);
  app.use("/invoice", invoiceRouter);
}
module.exports = route;
