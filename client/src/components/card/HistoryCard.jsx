// rafce

import React, { useState, useEffect } from "react";
import { getOrders } from "../../api/user";
import useEcomStore from "../../store/ecom-store";
import { dateFormat } from "../../utils/dateformat";
import { numberFormat } from "../../utils/number";

const HistoryCard = () => {
  const token = useEcomStore((state) => state.token);
  // console.log(token);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // code
    hdlGetOrders(token);
  }, []);

  const hdlGetOrders = (token) => {
    getOrders(token)
      .then((res) => {
        // console.log(res);
        setOrders(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ยังไม่ได้ดำเนินการ":
        return "bg-gray-100 text-gray-600";
      case "กำลังจัดส่ง":
        return "bg-orange-100 text-orange-600";
      case "รายการเสร็จสิ้น":
        return "bg-green-100 text-green-600";
      case "ยกเลิกแล้ว":
        return "bg-red-100 text-red-600";
    }
  };

  return (
    <div className="space-y-4">
      <hr/>
      <h1 className="text-2xl font-bold">ประวัติการสั่งซื้อ</h1>
      {/* คลุม */}
      <div className="space-y-4">
        {/* Card Loop Order*/}
        {orders?.map((item, index) => {
          // console.log(item)
          return (
            <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
              {/* ทีมงาน header */}
              <div className="flex justify-between mb-2">
                <div>
                  <p className="text-sm">วันที่สั่งซื้อ</p>
                  <p className="font-bold">{dateFormat(item.updatedAt)}</p>
                </div>
                <div>
                  <span className={`${getStatusColor(item.orderStatus)} 
                  px-2 py-1 rounded-full`}>
                    {item.orderStatus}
                  </span>
                </div>
              </div>
              {/* ทีมงาน table Loop Product*/}
              <div>
                <table className="border w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th>สินค้า</th>
                      <th>ราคา</th>
                      <th>จำนวน</th>
                      <th>รวม</th>
                    </tr>
                  </thead>

                  <tbody>
                    {item.products?.map((product, index) => {
                      // console.log(product);
                      return (
                        <tr key={index}>
                          <td className="text-center">{product.product.title}</td>
                          <td className="text-center">{numberFormat(product.product.price)} บาท</td>
                          <td className="text-center">{product.count}</td>
                          <td className="text-center">
                            {numberFormat(
                              product.count * product.product.price
                            )} บาท{" "}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* ทีมงาน Total */}
              <div>
                <div className="text-right">
                  <p>ราคาสุทธิ</p>
                  <p>{numberFormat(item.cartTotal)} บาท</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryCard;
