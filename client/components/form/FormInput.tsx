import { Input } from "antd";
import styled from "styled-components";
import ReactDatePicker from "react-datepicker";
import { CalendarOutlined } from "@ant-design/icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { FieldValues, useController, UseFormSetValue } from "react-hook-form";
import InputDropdown from "./InputDropdown";
import { IPerson } from "@/types";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
const { TextArea } = Input;
interface IProps {
  error: boolean;
}

const StyledFormInput = styled.div<IProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  .form-label {
    padding-bottom: 10px;
    margin-bottom: 4px;
    font-size: 16px;
    font-weight: 600;
    ::before {
      content: "*";
      color: #e5285d;
      margin-right: 4px;
    }
  }
  .form-input {
    background: white;
    border: none;
    outline: none;
    border: 1px solid ${(props) => (props.error ? "#e5285d" : "#dbdbdb")};
    color: black;
    padding: 12px;
    border-radius: 4px;
    ::placeholder {
      color: #d2c9cc;
    }
    :focus {
      border-color: #4096ff;
    }
    :disabled {
      cursor: not-allowed;
    }
  }
  .date-picker-container {
    background: white;
    position: relative;
    .date-picker {
      height: 40px;
      border-radius: 4px;
      width: 100%;
      .react-datepicker__input-container {
        height: 100%;
        input {
          width: 100% !important;
          height: 100%;
          border: 1px solid #dcdfe6;
          padding: 0 30px;
          ::placeholder {
            color: #d2c9cc;
          }
        }
      }
    }
    .placeholder-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 6px;
      color: #d2c9cc;
    }
  }
  .input-dropdown-container {
    width: 100%;
    display: flex;
    position: relative;
    .form-input {
      width: 100%;
    }
    .dropdown-container {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      z-index: 100;
      overflow-y: auto;
      max-height: 300px;
    }
  }
`;
const FormInput = ({
  labelString,
  inputId,
  type = "text",
  placeholder = "",
  control,
  setOuterDate,
  outerDate = new Date(),
  withSearch = false,
  outerVal,
  setOuterVal,
  dropdownData,
  setSelectVal,
  disabled = false,
  disabledVal = "",
  error = false,
  setValue,
}: {
  labelString: string;
  inputId: string;
  placeholder?: string;
  type?: "text" | "textarea" | "date" | "dropdown" | "dropdown_with_text";
  control?: any;
  setOuterDate?: Dispatch<SetStateAction<Date>>;
  outerDate?: Date;
  withSearch?: Boolean;
  outerVal?: any;
  setOuterVal?: Dispatch<SetStateAction<any>>;
  dropdownData?: IPerson[];
  setSelectVal?: Dispatch<SetStateAction<any>>;
  disabled?: boolean;
  disabledVal?: string | number;
  error?: boolean;
  setValue?: UseFormSetValue<FieldValues>;
}) => {
  const { field } = useController({
    control: control,
    name: inputId,
    defaultValue: "",
  });
  const ref = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  useOnClickOutside(ref, () => setShowDropdown(false));
  return (
    <StyledFormInput error={error}>
      <label className="form-label" htmlFor={inputId}>
        {labelString}
      </label>
      {type === "text" && !withSearch && (
        <input
          className="form-input"
          type="text"
          id={inputId}
          placeholder={placeholder}
          {...field}
          disabled={disabled}
        />
      )}
      {type === "textarea" && (
        <TextArea
          style={{ whiteSpace: "pre-wrap" }}
          rows={6}
          placeholder={placeholder}
          {...field}
        />
      )}
      {type === "date" && (
        <div className="date-picker-container">
          <ReactDatePicker
            wrapperClassName="date-picker"
            dateFormat="dd/MM/yyyy"
            placeholderText="Ngày/Tháng/Năm"
            selected={outerDate || new Date()}
            onChange={(date: Date) => {
              if (setOuterDate) setOuterDate(date);
            }}
          />
          <div className="placeholder-icon">
            <CalendarOutlined />
          </div>
        </div>
      )}
      {/* {disabled && (
        <input
          className="form-input"
          type="text"
          id={inputId}
          placeholder={placeholder}
          value={disabledVal}
          disabled={disabled}
        />
      )} */}
      {withSearch && (
        <div ref={ref} className="input-dropdown-container">
          <input
            onFocus={() => setShowDropdown(true)}
            className="form-input"
            type="text"
            id={inputId}
            placeholder={placeholder}
            {...field}
            value={outerVal}
            onChange={(e) => {
              if (setOuterVal) setOuterVal(e.target.value);
            }}
            autoComplete="off"
          />
          {showDropdown && (dropdownData as IPerson[])?.length > 0 && (
            <div className="dropdown-container">
              <InputDropdown
                data={dropdownData as IPerson[]}
                setShowDropdown={setShowDropdown}
                setSelectVal={setSelectVal as Dispatch<any>}
                setOuterQuery={setOuterVal as Dispatch<any>}
              />
            </div>
          )}
        </div>
      )}
    </StyledFormInput>
  );
};

export default FormInput;
