import { v4 as uuidv4 } from "uuid";
import { IStock } from "@/types";
import { easyReadMoney } from "@/utils/convert";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import FormInputNoControl from "./FormInputNoControl";

const StyledStockContainer = styled.div`
  .row-container {
    display: flex;
    gap: 40px;
    margin: 0 8px 12px;
    align-items: center;
    .stock_total {
      font-size: 16px;
    }
  }
`;
const StockRow = ({
  setStocks,
  stocks,
  index,
}: {
  setStocks: Dispatch<SetStateAction<IStock[]>>;
  stocks: IStock[];
  index: number;
}) => {
  const [stock, setStock] = useState<IStock>({
    ten_mat_hang: "",
    so_luong: 0,
    don_gia: 0,
    thanh_tien: 0,
    uuid: "",
  });

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setStock((prev: IStock) => {
      return { ...prev, ten_mat_hang: e.target.value as string };
    });
  };
  const handlePrice = (e: ChangeEvent<HTMLInputElement>) => {
    setStock((prev: IStock) => {
      return { ...prev, don_gia: Number(e.target.value) * 1000 };
    });
  };
  const handleAmount = (e: ChangeEvent<HTMLInputElement>) => {
    setStock((prev: IStock) => {
      return { ...prev, so_luong: Number(e.target.value) };
    });
  };
  useEffect(() => {
    setStocks((prev: IStock[]) => {
      const prevStocks = [...prev];
      prevStocks[index] = stock;
      return prevStocks.filter((element) => {
        return element.ten_mat_hang !== "";
      });
    });
  }, [stock]);
  useEffect(() => {
    if (stock.don_gia && stock.so_luong) {
      setStock((prev: IStock) => {
        return {
          ...prev,
          thanh_tien: prev.so_luong * prev.don_gia,
          uuid: uuidv4(),
        };
      });
    }
  }, [stock.don_gia, stock.so_luong]);
  return (
    <StyledStockContainer>
      <div className="row-container">
        <FormInputNoControl
          labelString="Tên mặt hàng"
          handleInput={handleName}
        />
        <FormInputNoControl
          handleInput={handlePrice}
          labelString="Đơn giá (Nghìn đồng)"
          placeholder="Ví dụ: (60)"
        />
        <FormInputNoControl labelString="Số lượng" handleInput={handleAmount} />
      </div>
      <div className="row-container">
        <div className="stock_total">
          Thành tiền: {easyReadMoney(stock.thanh_tien as number)}
        </div>
      </div>
    </StyledStockContainer>
  );
};

export default StockRow;
