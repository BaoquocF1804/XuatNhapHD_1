import axios from "axios";

export const publicRequest = axios.create({
  baseURL: "http://localhost:4000",
});
export const getPeopleWithSearchQuery = async (searchQuery: string) => {
  return await publicRequest.get("/person/get_people", {
    params: {
      ten_khach_hang: searchQuery,
    },
  });
};
export const getInvoices = async () => {
  return await publicRequest.get("/invoice/get");
};

export const getInvoicesById = async (id: string) => {
  return await publicRequest.get("/invoice/get_by_person_id", {
    params: {
      khach_hang_id: id,
    },
  });
};

export const getPeople = async () => {
  return await publicRequest.get("/person/get");
};

export const getInvoicesWithQuery = async (personName: string) => {
  return await publicRequest.get("/invoice/get_with_query", {
    params: {
      ten_khach_hang: personName,
    },
  });
};
export const changeInvoiceInfo = async (
  _id: string,
  so_tien_tra: number,
  khach_hang_id: string
) => {
  return await publicRequest.put("/invoice/change_invoice_info", {
    _id,
    so_tien_tra,
    khach_hang_id,
  });
};
