import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axiosClient from '../../axios';
import { useNavigate } from 'react-router-dom';
import { convertTimestampToDateTime, formatCurrency, useStateContext } from '../../contexts/ContextProvider';
import PaginationLinks from '../components/PaginationLinks';

const data = [
  { transactionId: 'N/A', invoiceId: '8G4JWI', client: 'Lallu Yadav', email: 'lallu@gmail.com', paymentDate: '2024-06-19 10:26 PM', amount: '3000.00', approved: 'Approved', method: 'Cash', status: 'Paid', attachment: 'N/A' },
  { transactionId: '4c918e', invoiceId: 'JE9FYI', client: 'InfyOm Client', email: 'client@infy-invoices.com', paymentDate: '2024-06-19 08:08 PM', amount: '6173.20', approved: 'Approved', method: 'Manual', status: 'Paid', attachment: 'N/A' },
  // Thêm các dòng khác tương tự
];

const Transaction = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: 'paymentDate', direction: 'ascending' })
  const [loadForm, setLoadForm] = useState(false)
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const { setNotification } = useStateContext()
  const [transactions, setTransaction] = useState([])

  useEffect(() => {
    axiosClient.get('/order/transaction/admin')
      .then(({ data }) => {
        setTransaction(data.data)
        setFilteredData(data.data)
      })
  }, [loadForm])
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "data.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Invoice ID', 'Client', 'Payment Date', 'Amount', 'Payment Method', 'Status']],
      body: transactions.map(row => [row.id, row.user_id.name, convertTimestampToDateTime(row.updated_at), formatCurrency(row.order_total), row.payment_method_ids.value, row.order_status])
    });
    doc.save('data.pdf');
  };
  useEffect(() => {
    setFilteredData(transactions)
    if (search === '') {

    } else {
      setFilteredData(
        transactions.filter(item =>
          item.id.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search])
  const lastPostIndex = currentPage * postsPerPage
  const firstPostIndex = lastPostIndex - postsPerPage
  const currentPosts = filteredData.slice(firstPostIndex, lastPostIndex)

  return (
    <div className="p-4">
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border p-2 rounded mr-4"
        />
        <button className="bg-blue-500 text-white p-2 rounded mr-2" onClick={exportToExcel}>Export to Excel</button>
        <button className="bg-green-500 text-white p-2 rounded" onClick={exportToPDF}>Export to PDF</button>
      </div>
      <div className="overflow-x-auto">
      <table className="table-fixed border-collapse border border-gray-400 w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">ID</th>
            <th className="border border-gray-400 px-4 py-2">User</th>
            <th className="border border-gray-400 px-4 py-2">Transaction Date</th>
            <th className="border border-gray-400 px-4 py-2">Amount</th>
            <th className="border border-gray-400 px-4 py-2">Type</th>
            <th className="border border-gray-400 px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((transaction, index) => (       
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
              <td className="border border-gray-400 px-4 py-2">{transaction.id}</td>
              <td className="border border-gray-400 px-4 py-2 text-cyan-600">{transaction?.user_id.name} <br/> ({transaction?.user_id.email})</td>
              <td className="border border-gray-400 px-4 py-2">{convertTimestampToDateTime(transaction.updated_at)}</td>
              <td className="border border-gray-400 px-4 py-2">{formatCurrency(transaction.order_total)}</td>
              <td className="border border-gray-400 px-4 py-2">{transaction.payment_method_ids.value}</td>
              <td className="border border-gray-400 px-4 py-2">{transaction.order_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
        
      {filteredData.length > 0 && <PaginationLinks totalPosts={filteredData.length} setPostsPerPage={setPostsPerPage} postsPerPage={postsPerPage} setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
}

export default Transaction;
