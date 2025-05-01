import React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const OrderRevenueChart = ({ orders }) => {
  const data = orders.map((order) => ({
    name: order.shippingAddress?.fullname || "Unknown",
    total: order.totalPrice,
  }));

  return (
    <div>
      <h5>Revenue Chart</h5>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderRevenueChart;
