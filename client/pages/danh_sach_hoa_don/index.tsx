import InvoiceListTable from "@/components/table/InvoiceListTable";
import MainLayout from "@/layout/MainLayout";
import { IInvoiceVar } from "@/types";
import { getInvoices } from "@/utils/callApi";
import Head from "next/head";
import { useEffect, useState } from "react";

const InvoiceList = () => {
  const [data, setData] = useState<IInvoiceVar[]>();
  useEffect(() => {
    getInvoices().then((response) => setData(response.data));
  }, []);
  return (
    <MainLayout>
      <Head>
        <title>Danh sách hoá đơn</title>
      </Head>
      <InvoiceListTable data={data} setData={setData} isChild={false} />
    </MainLayout>
  );
};

export default InvoiceList;
