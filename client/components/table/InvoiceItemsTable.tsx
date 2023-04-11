import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from "antd";
import { IStock } from "@/types";
import { easyReadMoney } from "@/utils/convert";

interface Item extends IStock {
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

const InvoiceItemsTable = ({ originData }: { originData: IStock[] }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: Item) => record._id === editingKey;
  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
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
      console.log(newData[index]);
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
      title: "Tên hàng hoá",
      dataIndex: "ten_mat_hang",
      width: "300px",
      editable: true,
    },
    {
      title: "Số lượng hàng hoá",
      dataIndex: "so_luong",
      width: "300px",
      editable: true,
    },
    {
      title: "Đơn giá ",
      dataIndex: "don_gia",
      width: "500px",
      editable: true,
      render: (_: any, record: Item) => easyReadMoney(record.don_gia),
    },
    {
      title: "Thành tiền",
      dataIndex: "thanh_tien",
      width: "300px",
      render: (_: any, record: Item) =>
        easyReadMoney(record.don_gia * record.so_luong),
    },
    {
      title: "Hành Động",
      dataIndex: "operation",
      width: "300px",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record._id)}
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
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType:
          col.dataIndex === "don_gia" || col.dataIndex === "so_luong"
            ? "number"
            : "text",
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
        pagination={false}
        bordered
        dataSource={data as Item[]}
        columns={mergedColumns}
        rowClassName="editable-row"
        rowKey="_id"
      />
    </Form>
  );
};

export default InvoiceItemsTable;
