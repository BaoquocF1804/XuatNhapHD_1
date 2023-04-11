import { IInvoiceVar } from "@/types";
import { getInvoicesById } from "@/utils/callApi";
import { useEffect, useState } from "react";
import InvoiceListTable from "./InvoiceListTable";

const InvoicesChildListTable = ({ id }: { id: string }) => {
  const [data, setData] = useState<IInvoiceVar[]>([]);
  useEffect(() => {
    if (id) {
      getInvoicesById(id).then((res) => setData(res.data));
    }
  }, [id]);
  return (
    <div>
      <InvoiceListTable data={data} setData={setData} isChild={true} />
    </div>
  );
};

export default InvoicesChildListTable;
