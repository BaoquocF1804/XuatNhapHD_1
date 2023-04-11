const VND = require("../../lib/currency");
const { updatePersonMoneyById } = require("../../lib/personHandle");
const { format } = require("date-fns");
const InvoiceModel = require("../models/Invoice.model");
const PersonModel = require("../models/Person.model");

class InvoiceController {
  async createInvoice(req, res) {
    const newInvoice = new InvoiceModel({
      khach_hang: req.body.khach_hang_id,
      so_tien_tra: req.body.so_tien_tra,
      hang_hoa: req.body.hang_hoa,
      ngay_mua: req.body.ngay_mua,
      ghi_chu: `Tạo hoá đơn với số tiền ban đầu là: ${VND(
        req.body.so_tien_tra
      )} vào ngày ${format(new Date(req.body.ngay_mua), "dd/MM/yyyy")}.\n ${
        req.body.ghi_chu
      }`,
      tong_tien: req.body.tong_tien,
    });
    try {
      const savedInvoice = await newInvoice.save();
      updatePersonMoneyById(req.body.khach_hang_id, {
        so_tien_no_them: req.body.tong_tien - req.body.so_tien_tra,
        tong_hoa_don: req.body.tong_tien,
      });
      return res.status(200).json(savedInvoice);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getInvoices(req, res) {
    try {
      const invoices = await InvoiceModel.find({})
        .populate({
          path: "khach_hang",
        })
        .sort({ created_at: -1 });
      let invoiceTotal = invoices.reduce(
        (prev, curr) => prev.hang_hoa + curr.hang_hoa,
        0
      );
      return res.status(200).json(invoices);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getInvoicesOfId(req, res) {
    try {
      const invoices = await InvoiceModel.find({
        khach_hang: req.query.khach_hang_id,
      })
        .populate({
          path: "khach_hang",
        })
        .sort({ created_at: -1 });
      return res.status(200).json(invoices);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getInvoicesWithQuery(req, res) {
    try {
      const findedPeople = await PersonModel.find({
        ten_khach_hang: {
          $regex: req.query?.ten_khach_hang,
          $options: "i",
        },
      });
      const invoices = await InvoiceModel.find({
        khach_hang: {
          $in: findedPeople.map((item) => item._id),
        },
      })
        .populate({
          path: "khach_hang",
        })
        .sort({ created_at: -1 });
      return res.status(200).json(invoices);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async changeInvoiceInfo(req, res) {
    try {
      const prevInvoice = await InvoiceModel.findByIdAndUpdate(req.body._id, [
        {
          $set: {
            so_tien_tra: req.body.so_tien_tra,
          },
        },
      ]);
      updatePersonMoneyById(req.body.khach_hang_id, {
        so_tien_no_them: prevInvoice.so_tien_tra - req.body.so_tien_tra,
        tong_hoa_don: 0,
      });
      const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
        req.body._id,
        {
          ghi_chu:
            prevInvoice.ghi_chu +
            `\nSố tiền trả thay đổi từ ${prevInvoice.so_tien_tra} sang ${req.body.so_tien_tra}`,
        },
        { new: true }
      );
      return res.status(200).json(updatedInvoice);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
module.exports = new InvoiceController();
