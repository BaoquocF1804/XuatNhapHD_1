import { IPerson } from "@/types";
import { easyReadMoney } from "@/utils/convert";
import styled from "styled-components";

const StyledPersonDropdownItem = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  cursor: pointer;
  :hover {
    background: #fafbfc;
  }
  .person-info {
    &-name {
      font-size: 14px;
      font-weight: 500;
    }
    &-address {
      font-size: 12px;
    }
  }
  .person-debt {
    &-title {
      font-size: 12px;
    }
    &-money {
      font-size: 12px;
      font-weight: 500;
    }
  }
`;
const PersonDropdownItem = ({
  data,
  handleClick = () => {},
}: {
  data: IPerson;
  handleClick: () => void;
}) => {
  return (
    <StyledPersonDropdownItem onClick={handleClick}>
      <div className="person-info">
        <div className="person-info-name">{data.ten_khach_hang}</div>
        <div className="person-info-address">{data.dia_chi}</div>
      </div>
      <div className="person-debt">
        <div className="person-debt-title">
          Nợ:{" "}
          <span className="person-debt-money">
            {easyReadMoney(data.so_tien_no)}
          </span>
        </div>
      </div>
    </StyledPersonDropdownItem>
  );
};

export default PersonDropdownItem;
