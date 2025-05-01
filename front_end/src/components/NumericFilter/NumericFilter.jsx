import React, { useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";

const NumericFilter = ({ label = "", onFilter }) => {
  const [filters, setFilters] = useState({ min: "", max: "" });
  const [showFilter, setShowFilter] = useState(false);

  const handleApply = () => {
    setShowFilter(false);
    onFilter(filters);
  };

  const handleReset = () => {
    const defaultFilter = { min: "", max: "" };
    setFilters(defaultFilter);
    setShowFilter(false);
    onFilter(defaultFilter);
  };

  return (
    <Dropdown show={showFilter} onToggle={() => setShowFilter(!showFilter)}>
      <Dropdown.Toggle as="span" style={{ cursor: "pointer" }} title={`Filter ${label}`}>
        <FaFilter />
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-2" style={{ minWidth: "220px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Form.Group className="mb-2">
            <Form.Label className="mb-1">Min {label}</Form.Label>
            <Form.Control
              type="number"
              value={filters.min}
              onChange={(e) => setFilters({ ...filters, min: e.target.value })}
              placeholder="e.g. 50"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="mb-1">Max {label}</Form.Label>
            <Form.Control
              type="number"
              value={filters.max}
              onChange={(e) => setFilters({ ...filters, max: e.target.value })}
              placeholder="e.g. 500"
            />
          </Form.Group>

          <div className="d-flex justify-content-between mt-2">
            <Button variant="secondary" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="primary" size="sm" onClick={handleApply}>
              OK
            </Button>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NumericFilter;
