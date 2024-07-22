import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axiosClient from '../../axios';


export default function TransactionChart() {
  // Function to calculate total income and expense by date
  const [orders, setOrder] = useState([])
  useEffect(()=>{
	axiosClient.get('/order/chart/transaction_chart')
	.then(({data})=>{
		setOrder(data.data)
	})
  },[])
  const calculateData = () => {
    let dataByDate = {};

    orders.forEach(order => {
      const orderDate = new Date(order.order_date);
      const month = orderDate.getMonth() + 1; // Month is zero-indexed
      const year = orderDate.getFullYear();
      const formattedDate = `${month}-${year}`;

      if (!dataByDate[formattedDate]) {
        dataByDate[formattedDate] = {
          date: formattedDate,
          income: 0,
          expense: 0
        };
      }

      const orderTotal = parseFloat(order.order_total);
      if (orderTotal > 0) {
        if (order.order_status === 5) {
          dataByDate[formattedDate].income += orderTotal;
        } else {
          dataByDate[formattedDate].expense += orderTotal;
        }
      }
    });

    // Convert object to array
    return Object.values(dataByDate);
  };

  // Prepare data for chart
  const data = calculateData();

  return (
    <div className="h-[22rem] bg-white p-8 rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Transactions</strong>
      <div className="mt-3 w-full flex-1 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
			margin={{ top: 20, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => formatLargeNumber(value)}/>
            <Tooltip />
            <Legend />
            <Bar dataKey="income" stackId="a" fill="#0ea5e9" name="Income" />
            <Bar dataKey="expense" stackId="a" fill="#ea580c" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const formatLargeNumber = (num) => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
};