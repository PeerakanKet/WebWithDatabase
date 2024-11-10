import React, { useState, useEffect } from "react";
import { getListAllUsers, changeUserStatus, changeUserRole } from "../../api/admin";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";

const TableUsers = () => {
  const token = useEcomStore((state) => state.token);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    handleGetUsers(token);
  }, [token]);

  const handleGetUsers = (token) => {
    getListAllUsers(token)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleChangeUserStatus = (userId, userStatus) => {
    const value = {
      id: userId,
      enabled: !userStatus,
    };
    changeUserStatus(token, value)
      .then(() => {
        handleGetUsers(token);
        toast.success("Status updated successfully!");
      })
      .catch((err) => console.log(err));
  };

  const handleChangeUserRole = (userId, userRole) => {
    const value = {
      id: userId,
      role: userRole,
    };
    changeUserRole(token, value)
      .then(() => {
        handleGetUsers(token);
        toast.success("Role updated successfully!");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 text-center">User Management</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 font-semibold text-gray-600 text-center">ลำดับ</th>
            <th className="p-3 font-semibold text-gray-600 text-center">อีเมล</th>
            <th className="p-3 font-semibold text-gray-600 text-center">สิทธิ์</th>
            <th className="p-3 font-semibold text-gray-600 text-center">สถานะ</th>
            <th className="p-3 font-semibold text-gray-600 text-center">จัดการ</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="border-b">
              <td className="p-4 text-center text-gray-700">{index + 1}</td>
              <td className="p-4 text-center text-gray-700">{user.email}</td>
              <td className="p-4 text-center">
                <select
                  onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                  value={user.role}
                  className="p-2 bg-gray-50 border border-gray-300 rounded-md"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-4 text-center">
                <span className={`px-3 py-1 rounded-full text-white ${user.enabled ? "bg-green-500" : "bg-red-500"}`}>
                  {user.enabled ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-4 text-center">
                <button
                  className={`p-2 rounded-md shadow-md text-white ${user.enabled ? "bg-red-500" : "bg-green-500"}`}
                  onClick={() => handleChangeUserStatus(user.id, user.enabled)}
                >
                  {user.enabled ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableUsers;
