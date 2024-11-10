import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";

// กำหนด schema สำหรับตรวจสอบความถูกต้องของข้อมูล (Validation Schema)
const registerSchema = z
  .object({
    email: z.string().email({ message: "อีเมลไม่ถูกต้อง" }),
    password: z.string().min(8, { message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

const Register = () => {
  // ใช้ useState เพื่อเก็บคะแนนความปลอดภัยของรหัสผ่าน
  const [passwordScore, setPasswordScore] = useState(0);

  // ใช้ useForm สำหรับจัดการฟอร์มและตรวจสอบความถูกต้อง
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // ฟังก์ชันตรวจสอบความปลอดภัยของรหัสผ่าน
  const validatePassword = () => {
    let password = watch().password;
    return zxcvbn(password ? password : "").score;
  };

  // อัพเดตคะแนนความปลอดภัยของรหัสผ่านเมื่อรหัสผ่านเปลี่ยนแปลง
  useEffect(() => {
    setPasswordScore(validatePassword());
  }, [watch().password]);

  // ฟังก์ชันที่ทำงานเมื่อส่งฟอร์ม
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:5001/api/register", data);
      console.log(res.data);
      toast.success(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
      console.log(err);
    }
  };

  // เริ่มการ render UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transition-all hover:scale-105 duration-200">
        <h1 className="text-3xl text-center font-extrabold text-gray-700 mb-6">Register</h1>

        {/* ฟอร์มการสมัคร */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* ช่องกรอกอีเมล */}
            <div>
              <input
                {...register("email")}
                placeholder="อีเมล"
                className={`border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email && "border-red-500"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* ช่องกรอกรหัสผ่าน */}
            <div>
              <input
                {...register("password")}
                placeholder="รหัสผ่าน"
                type="password"
                className={`border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password && "border-red-500"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
              {/* แสดงแถบคะแนนความปลอดภัยของรหัสผ่าน */}
              {watch().password?.length > 0 && (
                <div className="flex mt-2 space-x-1">
                  {Array.from(Array(5).keys()).map((item, index) => (
                    <div
                      key={index}
                      className={`w-1/5 h-2 rounded transition-colors ${
                        index < passwordScore
                          ? passwordScore <= 2
                            ? "bg-red-500"
                            : passwordScore < 4
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            {/* ช่องยืนยันรหัสผ่าน */}
            <div>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="ยืนยันรหัสผ่าน"
                className={`border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.confirmPassword && "border-red-500"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* ปุ่มสมัคร */}
            <button
              type="submit"
              className="bg-blue-500 w-full text-white font-bold py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
