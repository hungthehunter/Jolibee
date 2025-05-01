import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import ExportExcelButton from "../../components/ExportExcelButton/ExportExcelButton";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
const TableComponent = ({
  selectionType = "checkbox",
  products = [],
  isPending = false,
  setSelectedIds,
  columns = [],
  action,
  rowSelected,
  setRowSelected,
}) => {
  const [selectedIdsLocal, setSelectedIdsLocal] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSelectAll = (e) => {
    const newSelected = e.target.checked ? products.map((p) => p._id) : [];
    setSelectedIdsLocal(newSelected);
    setRowSelected(null);
    setSelectedIds && setSelectedIds(newSelected);
  };

  const handleSelectOne = (e, product) => {
    const id = product._id;
    const newSelected = selectedIdsLocal.includes(id)
      ? selectedIdsLocal.filter((x) => x !== id)
      : [...selectedIdsLocal, id];

    setSelectedIdsLocal(newSelected);
    setSelectedIds && setSelectedIds(newSelected);
    setRowSelected(id);
  };

  const handleSort = (col) => {
    if (sortColumn === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortOrder("asc");
    }
  };

  const getSortedProducts = () => {
    if (!sortColumn) return products;

    return [...products].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      if (typeof valA === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });
  };

  const sortedProducts = getSortedProducts();
  

  return (
    <>
      <LoadingComponent isPending={isPending} />
      <ExportExcelButton
  products={products}
  columns={columns}
  fileName="products.xlsx"
  sortColumn={sortColumn}
  sortOrder={sortOrder}
/>
      <Table bordered hover responsive>
        <thead>
          <tr>
            {selectionType === "checkbox" && (
              <th>
                <Form.Check
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    products.length > 0 &&
                    selectedIdsLocal.length === products.length
                  }
                />
              </th>
            )}
            {columns.map((col, index) => (
              <th
                key={index}
                onClick={() => handleSort(col.dataIndex)}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {col.title}
                {sortColumn === col.dataIndex && (
                  <span>{sortOrder === "asc" ? " 🔼" : " 🔽"}</span>
                )}
              </th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <tr
                key={product._id}
                style={{
                  backgroundColor:
                    rowSelected === product._id ? "#f0f0f0" : "transparent",
                }}
              >
                {selectionType === "checkbox" && (
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedIdsLocal.includes(product._id)}
                      onChange={(e) => handleSelectOne(e, product)}
                    />
                  </td>
                )}
                {columns.map((col, index) => (
                  <td key={index}>
                    {col.render
                      ? col.render(product[col.dataIndex], product)
                      : product[col.dataIndex]}
                  </td>
                ))}
                <td>{action ? action(product) : null}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  columns.length + (selectionType === "checkbox" ? 2 : 1)
                }
              >
                There is nothing ....
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default TableComponent;
