import ExcelJS from "exceljs";
import { Button } from "react-bootstrap";

const ExportExcelButton = ({
  products = [],
  columns = [],
  fileName = "FantastyBurger.xlsx",
  sortColumn = null,
  sortOrder = "asc",
}) => {
  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    const filteredColumns = columns.filter((col) => col.title !== "Image");
    const header = filteredColumns.map((col) =>
        col.exportTitle || (typeof col.title === "string" ? col.title : "Untitled")
      );
      
    worksheet.addRow(header);
    worksheet.getRow(1).font = { bold: true };

    const safeStringify = (obj) => {
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) return "[Circular]";
          seen.add(value);
        }
        return value;
      });
    };

    const exportProducts = [...products].sort((a, b) => {
      if (!sortColumn) return 0;
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

    exportProducts.forEach((product) => {
      const row = filteredColumns.map((col) => {
        try {
          if (col.exportRender) {
            return col.exportRender(product[col.dataIndex], product);
          }

          const value = product[col.dataIndex];
          if (value === null || value === undefined) return "";

          if (typeof value === "object") {
            return safeStringify(value);
          }

          return value;
        } catch (err) {
          console.warn(
            "Lỗi khi export Excel ở cột:",
            col.title,
            "Giá trị:",
            product[col.dataIndex],
            "Lỗi:",
            err
          );
          return "[Error]";
        }
      });

      worksheet.addRow(row);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExportExcel} className="mb-3">
      Export Excel
    </Button>
  );
};

export default ExportExcelButton;
