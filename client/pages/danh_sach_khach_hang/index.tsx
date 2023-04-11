import PersonTable from "@/components/table/PersonTable";
import MainLayout from "@/layout/MainLayout";
import { IPerson } from "@/types";
import { getPeople } from "@/utils/callApi";
import Head from "next/head";
import { useEffect, useState } from "react";

const InvoiceList = () => {
  const [data, setData] = useState<IPerson[]>([]);
  useEffect(() => {
    getPeople().then((res) => setData(res.data));
  }, []);
  return (
    <MainLayout>
      <Head>
        <title>Danh sách khách hàng</title>
      </Head>
      <PersonTable data={data} setData={setData} />
    </MainLayout>
  );
};

export default InvoiceList;
