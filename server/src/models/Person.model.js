const mongoose = require("mongoose");
const PersonSchema = new mongoose.Schema(
  {
    ten_khach_hang: {
      type: String,
      require: true,
    },
    so_dien_thoai: {
      type: String,
    },
    dia_chi: {
      type: String,
    },
    so_tien_no: {
      type: Number,
    },
    tong_tien_mua: {
      type: Number,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);
module.exports = mongoose.model("Person", PersonSchema);
