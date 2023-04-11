import InvoiceListTable from "@/components/table/InvoiceListTable";
import useDebounce from "@/hooks/useDebounce";
import MainLayout from "@/layout/MainLayout";
import { IInvoiceVar, IPerson } from "@/types";
import { getInvoicesWithQuery } from "@/utils/callApi";
import { useEffect, useState } from "react";
import styled from "styled-components";
const StyledSearchContainer = styled.div`
  .input-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 20px;
    input {
      max-width: 500px;
      width: 100%;
      padding: 12px 16px;
      border: none;
      outline: none;
      ::placeholder {
        color: #827e7f;
      }
      :focus {
        border-color: #4096ff;
      }
      :disabled {
        cursor: not-allowed;
      }
    }
  }
  .table-container {
  }
`;
const index = () => {
  const [personName, setPersonName] = useState("");
  const personNameDebounce = useDebounce(personName, 500);
  const [data, setData] = useState<IInvoiceVar[]>([]);
  useEffect(() => {
    if (personNameDebounce !== "") {
      getInvoicesWithQuery(personNameDebounce).then((res) => {
        console.log(res.data);
        setData(res.data);
      });
    }
  }, [personNameDebounce]);
  return (
    <MainLayout>
      <title>Tìm kiếm hoá đơn</title>
      <StyledSearchContainer>
        <div className="input-container">
          <input
            type="text"
            placeholder="Nhập vào tên khách hàng"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
          />
        </div>
        <div className="table-container">
          <InvoiceListTable data={data} setData={setData} />
        </div>
      </StyledSearchContainer>
    </MainLayout>
  );
};

export default index;
