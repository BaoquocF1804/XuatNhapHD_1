const PersonModel = require("../src/models/Person.model");

async function updatePersonMoneyById(_id, data) {
  return await PersonModel.findByIdAndUpdate(_id, {
    $inc: {
      so_tien_no: data.so_tien_no_them,
      tong_tien_mua: data.tong_hoa_don,
    },
  });
}
async function updatePersonInfo(_id, data) {
  return await PersonModel.findByIdAndUpdate(_id, data);
}
module.exports = { updatePersonMoneyById, updatePersonInfo };
