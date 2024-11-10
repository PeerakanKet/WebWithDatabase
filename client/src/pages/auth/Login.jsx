import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import useEcomStore from '../../store/ecom-store'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  // Hook สำหรับจัดการการเปลี่ยนหน้าและข้อมูลผู้ใช้
  const navigate = useNavigate()
  const actionLogin = useEcomStore((state) => state.actionLogin)
  const user = useEcomStore((state) => state.user)
  console.log('user from zustand', user)

  // เก็บข้อมูลฟอร์มใน state
  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  // ฟังก์ชันสำหรับอัพเดตข้อมูลในฟอร์ม
  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ฟังก์ชันที่ทำงานเมื่อส่งฟอร์ม
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await actionLogin(form)
      const role = res.data.payload.role
      roleRedirect(role)
      toast.success('Welcome Back')
    } catch (err) {
      console.log(err)
      const errMsg = err.response?.data?.message
      toast.error(errMsg)
    }
  }

  // ฟังก์ชันสำหรับการเปลี่ยนเส้นทางตามบทบาทผู้ใช้
  const roleRedirect = (role) => {
    if (role === 'admin') {
      navigate('/admin/manage')
    } else {
      navigate(-1)
    }
  }

  // เริ่มการ render UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transition-all hover:scale-105 duration-200">
        <h1 className="text-3xl text-center font-extrabold text-gray-700 mb-6">Login</h1>

        {/* ฟอร์มการเข้าสู่ระบบ */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ช่องกรอกอีเมล */}
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Email</label>
            <input
              className="border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleOnChange}
              name="email"
              type="email"
              placeholder="อีเมล"
            />
          </div>

          {/* ช่องกรอกรหัสผ่าน */}
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Password</label>
            <input
              className="border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleOnChange}
              name="password"
              type="password"
              placeholder="รหัสผ่าน"
            />
          </div>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit"
            className="bg-blue-500 w-full text-white font-bold py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
