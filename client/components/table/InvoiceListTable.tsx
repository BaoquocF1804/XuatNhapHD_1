import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import { IInvoiceVar, IStock } from "@/types";
import styled from "styled-components";
import InvoiceItemsTable from "./InvoiceItemsTable";
import { easyReadMoney } from "@/utils/convert";

import { format } from "date-fns";
import _ from "lodash";
import { changeInvoiceInfo } from "@/utils/callApi";

interface Item extends IInvoiceVar {
  key: React.Key;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const InvoiceListTable = ({
  data,
  setData,
  isChild = false,
}: {
  data: IInvoiceVar[];
  setData: Dispatch<SetStateAction<IInvoiceVar[]>>;
  isChild?: boolean;
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: Item) => record._id === editingKey;
  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", dia_chi: "", ...record });
    setEditingKey(record._id as string);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });

        setData(newData);

        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
      changeInvoiceInfo(
        newData[index]._id,
        newData[index].so_tien_tra,
        newData[index].khach_hang._id
      ).then((res) => console.log(res.data));
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const handleDelete = (key: React.Key) => {
    const newData = data.filter((item) => item._id !== key);
    setData(newData);
  };
  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: ["khach_hang", "ten_khach_hang"],
      width: "300px",
      // editable: true,
    },
    isChild
      ? {}
      : {
          title: "Số điện thoại",
          dataIndex: ["khach_hang", "so_dien_thoai"],
          width: "300px",
          // editable: true,
        },
    isChild
      ? {}
      : {
          title: "Địa chỉ",
          dataIndex: ["khach_hang", "dia_chi"],
          width: "500px",
          // editable: true,
        },
    {
      title: "Tổng hoá đơn",
      dataIndex: "tong_tien",
      width: "300px",
      // editable: true,
      render: (_: any, record: Item) =>
        easyReadMoney(record?.tong_tien as number),
    },
    {
      title: "Số tiền trả",
      dataIndex: "so_tien_tra",
      width: "300px",
      editable: true,
      render: (_: any, record: Item) => easyReadMoney(record?.so_tien_tra),
    },
    isChild
      ? {}
      : {
          title: "Hành Động",
          dataIndex: "operation",
          width: "300px",
          render: (_: any, record: Item) => {
            const editable = isEditing(record);
            return editable ? (
              <span>
                <Typography.Link
                  onClick={() => {
                    save(record._id);
                  }}
                  style={{ marginRight: 8 }}
                >
                  Lưu lại
                </Typography.Link>
                <Popconfirm title="Bạn muốn huỷ?" onConfirm={cancel}>
                  <a>Huỷ</a>
                </Popconfirm>
              </span>
            ) : (
              <>
                <Typography.Link
                  disabled={editingKey !== ""}
                  onClick={() => edit(record)}
                >
                  Sửa
                </Typography.Link>
                <Popconfirm
                  title="Chắc chắn xoá?"
                  onConfirm={() => handleDelete(record._id)}
                >
                  <a style={{ color: "red", marginLeft: "8px" }}>Xoá</a>
                </Popconfirm>
              </>
            );
          },
        },
    isChild
      ? {
          title: "Ngày tạo hoá đơn",
          dataIndex: "created_at",
          width: "300px",
          render: (_: any, record: Item) =>
            format(new Date(record.created_at as string), "dd/MM/yyyy"),
        }
      : {},
  ].filter((elem) => !_.isEmpty(elem));

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "so_tien_tra" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data as Item[]}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
        rowKey="_id"
        expandable={{
          expandedRowRender: (record) => (
            <StyledExpandableContainer>
              <div
                className="exp-title"
                style={{ fontWeight: 600, fontSize: "16px" }}
              >
                Danh sách hàng hoá{" "}
              </div>
              <InvoiceItemsTable originData={record.hang_hoa} />
              <div className="exp-item">
                <div className="exp-item-title">Ngày mua:</div>
                <p className="exp-item-content">
                  {format(new Date(record.ngay_mua as string), "dd/MM/yyyy")}
                </p>
              </div>
              <div className="exp-item">
                <div className="exp-item-title">Ghi chú:</div>
                <p
                  className="exp-item-content"
                  dangerouslySetInnerHTML={{ __html: record.ghi_chu }}
                ></p>
              </div>
            </StyledExpandableContainer>
          ),
          // rowExpandable: (record) => record.name !== "Not Expandable",
        }}
      />
    </Form>
  );
};

export default InvoiceListTable;

const StyledExpandableContainer = styled.div`
  margin: 12px 0;
  .exp-item {
    margin-top: 12px;
    &-title {
      font-weight: 600;
    }
    &-content {
      margin-left: 8px;
    }
  }
`;
