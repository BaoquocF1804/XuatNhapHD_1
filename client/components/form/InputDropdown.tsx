import { IPerson } from "@/types";
import { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import PersonDropdownItem from "./PersonDropdownItem";

const StyledInputDropdown = styled.div`
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;
const InputDropdown = ({
  data,
  setSelectVal,
  setOuterQuery,
  setShowDropdown,
}: {
  data: IPerson[];
  setSelectVal: Dispatch<SetStateAction<any>>;
  setOuterQuery: Dispatch<SetStateAction<any>>;
  setShowDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <StyledInputDropdown>
      {data.map((item) => (
        <PersonDropdownItem
          handleClick={() => {
            setOuterQuery(item.ten_khach_hang);
            setSelectVal(item);
            setShowDropdown(false);
          }}
          key={item._id}
          data={item}
        />
      ))}
    </StyledInputDropdown>
  );
};

export default InputDropdown;
