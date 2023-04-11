import FormInput from "@/components/form/FormInput";
import MainLayout from "@/layout/MainLayout";
import Head from "next/head";
import styled from "styled-components";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import StockRow from "@/components/form/StockRow";
import { IPerson, IStock } from "@/types";
import { PlusCircleOutlined } from "@ant-design/icons";
import { easyReadMoney } from "@/utils/convert";
import { getPeopleWithSearchQuery, publicRequest } from "@/utils/callApi";
import _ from "lodash";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Spinner from "@/components/loading/Spinner";
import { useRouter } from "next/router";
const StyledFormContainer = styled.form`
  width: 100%;
  max-width: 1000px;
  margin: auto;
  .row-container {
    display: flex;
    gap: 40px;
    margin: 0 8px 12px;
    align-items: center;
  }
  .total {
    font-size: 20px;
    font-weight: 600;
  }
  .icon-container {
    justify-content: center;
    font-size: 20px;
    .add-btn {
      border: none;
      background: #1f28af;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      color: white;
      cursor: pointer;
      border-radius: 8px;
      svg {
        font-size: 26px;
        color: white;
        margin-right: 8px;
      }
    }
  }
  .hoadon-title {
    font-size: 24px;
    font-weight: 600;
    margin: 20px 0;
  }
  .submit-btn {
    margin-top: 40px;
    background: #1f28af;
    color: white;
    padding: 12px 20px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    cursor: pointer;
    max-width: 200px;
    text-align: center;
  }
`;
const schema = yup.object({
  so_tien_tra: yup.number().required(),
  ghi_chu: yup.string(),
  dia_chi: yup.string().required(),
});
const index = () => {
  const {
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [stocks, setStocks] = useState<IStock[]>([]);
  const [defaultNumber, setDefaultNumber] = useState(3);
  const [buyDate, setBuyDate] = useState<Date>(new Date());
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchPeople, setSearchPeople] = useState<IPerson[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPerson, setSelectedPerson] = useState<IPerson>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const createPerson = async (data: any) => {
    return await publicRequest.post("/person/post", {
      ten_khach_hang: searchQuery,
      so_dien_thoai: data.so_dien_thoai,
      dia_chi: data.dia_chi,
    });
  };
  const createInvoice = async (data: any, _id: string) => {
    return await publicRequest.post("/invoice/post", {
      khach_hang_id: _id,
      so_tien_tra: data.so_tien_tra * 1000,
      hang_hoa: stocks.filter((element) => {
        return element.ten_mat_hang !== "";
      }),
      ngay_mua: buyDate.toISOString(),
      ghi_chu: data.ghi_chu,
      tong_tien: totalPrice,
    });
  };

  const onSubmitHandler = async (data: any) => {
    // console.log({
    //   ...data,
    //   totalPrice: totalPrice,
    //   so_tien_tra: data.so_tien_tra * 1000,
    //   ngay_mua: buyDate.toISOString(),
    //   hang_hoa: stocks,
    //   tong_tien: totalPrice,
    //   ten_khach_hang: searchQuery,
    // });
    // setIsLoading(true);
    if (!isValid) {
      console.log("looix");
      setIsLoading(false);
      return;
    }

    try {
      if (selectedPerson?.ten_khach_hang !== searchQuery) {
        createPerson(data).then((response) =>
          createInvoice(data, response.data._id).then((res) => {
            console.log(res.data);
            setIsLoading(false);
            router.push("/danh_sach_hoa_don");
          })
        );
      } else {
        console.log("đã tồn tại");
        createInvoice(data, selectedPerson._id).then((res) => {
          console.log(res.data);
          setIsLoading(false);
          router.push("/danh_sach_hoa_don");
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setTotalPrice(
      stocks.reduce(
        (prev, curr: IStock) =>
          curr.ten_mat_hang ? prev + (curr?.thanh_tien as number) : prev,
        0
      )
    );
  }, [stocks]);
  useEffect(() => {
    if (searchQuery !== "")
      getPeopleWithSearchQuery(searchQuery).then((res) =>
        setSearchPeople(res.data)
      );
    if (searchQuery !== selectedPerson?.ten_khach_hang) {
      setSelectedPerson({} as IPerson);
    }
  }, [searchQuery]);
  useEffect(() => {
    if (searchQuery === selectedPerson?.ten_khach_hang) {
      setValue("so_dien_thoai", selectedPerson.so_dien_thoai);
      setValue("dia_chi", selectedPerson.dia_chi);
    }
  }, [selectedPerson, searchQuery]);
  // useEffect(() => {
  //   setValue("tongHoaDon", totalPrice)
  // },[totalPrice])
  return (
    <MainLayout>
      <Head>
        <title>Nhập hoá đơn</title>
      </Head>
      <StyledFormContainer
        onSubmit={handleSubmit(onSubmitHandler as SubmitHandler<FieldValues>)}
      >
        <div className="hoadon-title">Thông tin người mua hàng</div>
        <div className="row-container">
          <FormInput
            control={control}
            labelString="Tên khách hàng"
            inputId="ten_khach_hang"
            withSearch={true}
            outerVal={searchQuery}
            setOuterVal={setSearchQuery}
            setSelectVal={setSelectedPerson}
            dropdownData={searchPeople}
          />
          <FormInput
            control={control}
            labelString="Số điện thoại"
            inputId="so_dien_thoai"
            disabled={searchQuery === selectedPerson?.ten_khach_hang}
            disabledVal={selectedPerson?.so_dien_thoai}
          />
          <FormInput
            control={control}
            labelString="Địa chỉ"
            inputId="dia_chi"
            disabled={searchQuery === selectedPerson?.ten_khach_hang}
            disabledVal={selectedPerson?.dia_chi}
          />
        </div>
        <div className="hoadon-title">Hoá đơn bán hàng</div>
        {new Array(defaultNumber).fill(0).map((item, index) => (
          <StockRow
            key={index}
            setStocks={setStocks}
            stocks={stocks}
            index={index}
          />
        ))}
        <div className="row-container icon-container">
          <button
            onClick={() => setDefaultNumber((prev) => prev + 1)}
            type="button"
            className="add-btn"
          >
            <PlusCircleOutlined /> Thêm hàng hoá
          </button>
        </div>

        <div className="row-container total">
          Tổng tiền hoá đơn: {easyReadMoney(totalPrice)}
        </div>
        <div className="row-container">
          <FormInput
            control={control}
            labelString="Số tiền khách trả (Nghìn đồng)"
            inputId="so_tien_tra"
            error={!!errors.so_tien_tra}
          />
          <FormInput
            control={control}
            labelString="Ngày mua"
            type="date"
            inputId="ngay_mua"
            setOuterDate={setBuyDate}
            outerDate={buyDate}
          />
        </div>
        <div className="row-container">
          <FormInput
            control={control}
            labelString="Ghi chú"
            inputId="ghi_chu"
            type="textarea"
          />
        </div>
        <button type="submit" className="submit-btn">
          {!isLoading ? (
            <>Lưu hoá đơn</>
          ) : (
            <>
              <Spinner />
            </>
          )}
        </button>
      </StyledFormContainer>
    </MainLayout>
  );
};

export default index;
