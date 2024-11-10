import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { createProduct, deleteProduct } from "../../api/product";
import { toast } from "react-toastify";
import Uploadfile from "./Uploadfile";
import { Link } from "react-router-dom";
import { Pencil, Trash } from "lucide-react";
import { numberFormat } from "../../utils/number";
import { dateFormat } from "../../utils/dateformat";

const initialState = {
  title: "",
  description: "",
  price: 0,
  quantity: 0,
  categoryId: "",
  images: [],
};

const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    getCategory();
    getProduct(100);
  }, []);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createProduct(token, form);
      setForm(initialState);
      getProduct();
      toast.success(`Added ${res.data.title} successfully!`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await deleteProduct(token, id);
        toast.success("Product deleted successfully!");
        getProduct();
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and Description */}
        <div className="flex gap-4">
          <div className="w-full">
            <label className="text-gray-600 text-sm mb-2 block" htmlFor="title">
              ชื่อ
            </label>
            <input
              id="title"
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={form.title}
              onChange={handleOnChange}
              placeholder="Title"
              name="title"
              required
            />
          </div>

          <div className="w-full">
            <label
              className="text-gray-600 text-sm mb-2 block"
              htmlFor="description"
            >
              รายละเอียด
            </label>
            <input
              id="description"
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={form.description}
              onChange={handleOnChange}
              placeholder="Description"
              name="description"
              required
            />
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="flex gap-4">
          <div className="w-full">
            <label className="text-gray-600 text-sm mb-2 block" htmlFor="price">
              ราคา
            </label>
            <input
              id="price"
              type="number"
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.price}
              onChange={handleOnChange}
              placeholder="Price"
              name="price"
              required
            />
          </div>

          <div className="w-full">
            <label
              className="text-gray-600 text-sm mb-2 block"
              htmlFor="quantity"
            >
              จำนวน
            </label>
            <input
              id="quantity"
              type="number"
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.quantity}
              onChange={handleOnChange}
              placeholder="Quantity"
              name="quantity"
              required
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="w-full">
          <label className="text-gray-600 text-sm mb-2 block" htmlFor="categoryId">
            Category
          </label>
          <select
            id="categoryId"
            className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="categoryId"
            onChange={handleOnChange}
            value={form.categoryId}
            required
          >
            <option value="" disabled>
              เลือกหมวดหมู่
            </option>
            {categories.map((item, index) => (
              <option key={index} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Upload File Component */}
        <Uploadfile form={form} setForm={setForm} />

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md shadow-md w-full hover:bg-blue-600 transition duration-200"
        >
          เพิ่มสินค้า
        </button>
      </form>

      <hr className="my-6" />

      {/* Product Table */}
      <table className="w-full border border-gray-300 rounded-md shadow-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">ลำดับ</th>
            <th className="px-4 py-2">ภาพ</th>
            <th className="px-4 py-2">ชื่อสินค้า</th>
            <th className="px-4 py-2">รายละเอียด</th>
            <th className="px-4 py-2">ราคา</th>
            <th className="px-4 py-2">จำนวน</th>
            <th className="px-4 py-2">ขายได้</th>
            <th className="px-4 py-2">อัพเดทล่าสุด</th>
            <th className="px-4 py-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                {item.images.length > 0 ? (
                  <img
                    className="w-24 h-24 rounded-lg shadow-md"
                    src={item.images[0].url}
                    alt={item.title}
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center shadow-sm">
                    No Image
                  </div>
                )}
              </td>
              <td className="px-4 py-2">{item.title}</td>
              <td className="px-4 py-2">{item.description}</td>
              <td className="px-4 py-2">{numberFormat(item.price)} บาท</td>
              <td className="px-4 py-2">{item.quantity}</td>
              <td className="px-4 py-2">{item.sold}</td>
              <td className="px-4 py-2">{dateFormat(item.updatedAt)}</td>
              <td className="px-4 py-2 flex gap-2 justify-center">
                <Link
                  to={`/admin/product/${item.id}`}
                  className="bg-yellow-500 text-white p-2 rounded-md shadow-md hover:bg-yellow-600 transition duration-200"
                >
                  <Pencil />
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white p-2 rounded-md shadow-md hover:bg-red-600 transition duration-200"
                >
                  <Trash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormProduct;
