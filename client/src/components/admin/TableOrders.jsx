import React, { useEffect, useState } from "react";
import { getOrdersAdmin, changeOrderStatus } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const TableOrders = () => {
  const token = useEcomStore((state) => state.token);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    handleGetOrder(token);
  }, []);

  const handleGetOrder = (token) => {
    getOrdersAdmin(token)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeOrderStatus = (token, orderId, orderStatus) => {
    changeOrderStatus(token, orderId, orderStatus)
      .then((res) => {
        toast.success("Update Status Success!!!");
        handleGetOrder(token);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Update the getStatusColor function to handle new statuses
  const getStatusColor = (status) => {
    switch (status) {
      case "ยังไม่ได้ดำเนินการ": // Not Process
        return "bg-gray-100 text-gray-600";
      case "กำลังจัดส่ง": // Processing
        return "bg-orange-100 text-orange-600";  // Orange color
      case "รายการเสร็จสิ้น": // Completed
        return "bg-green-100 text-green-600";  // Green color
      case "ยกเลิกแล้ว": // Cancelled
        return "bg-red-100 text-red-600";  // Red color
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Order Management
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full mx-auto table-auto border-separate border-spacing-0 text-center">
          <thead className="bg-gray-200 text-sm">
            <tr>
              <th className="px-4 py-2 font-semibold text-gray-700">ลำดับ</th>
              <th className="px-4 py-2 font-semibold text-gray-700">ผู้ใช้</th>
              <th className="px-4 py-2 font-semibold text-gray-700">วันที่</th>
              <th className="px-4 py-2 font-semibold text-gray-700">สินค้า</th>
              <th className="px-4 py-2 font-semibold text-gray-700">ยอดรวม</th>
              <th className="px-4 py-2 font-semibold text-gray-700">สถานะ</th>
              <th className="px-4 py-2 font-semibold text-gray-700">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition duration-150 text-center"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{item.orderedBy.email}</p>
                  <p className="text-sm text-gray-600">{item.orderedBy.address}</p>
                </td>
                <td className="px-4 py-3">{dateFormat(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <ul>
                    {item.products?.map((product, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{product.product.title}</span>
                        <span className="text-sm text-gray-600">
                          {product.count} x {numberFormat(product.product.price)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-3">{numberFormat(item.cartTotal)} บาท</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                      item.orderStatus
                    )}`}
                  >
                    {item.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={item.orderStatus}
                    onChange={(e) =>
                      handleChangeOrderStatus(token, item.id, e.target.value)
                    }
                    className="px-3 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>ยังไม่ได้ดำเนินการ</option>
                    <option>กำลังจัดส่ง</option>
                    <option>รายการเสร็จสิ้น</option>
                    <option>ยกเลิกแล้ว</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableOrders;
