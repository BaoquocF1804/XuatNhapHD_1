function VND(x) {
  return x.toLocaleString("it-IT", { style: "currency", currency: "VND" });
}
module.exports = VND;
