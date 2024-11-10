import React, { useState, useEffect } from 'react'
import { createCategory, listCategory, removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify'

const FormCategory = () => {
    const token = useEcomStore((state) => state.token)
    const [name, setName] = useState('')
    const categories = useEcomStore((state) => state.categories)
    const getCategory = useEcomStore((state) => state.getCategory)
    
    useEffect(() => {
        getCategory(token)
    }, [token])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            return toast.warning('Please fill in the category name.')
        }
        try {
            const res = await createCategory(token, { name })
            toast.success(`Category "${res.data.name}" added successfully!`)
            getCategory(token)
            setName('') // Clear the input field after successful submission
        } catch (err) {
            console.log(err)
        }
    }

    const handleRemove = async (id) => {
        try {
            const res = await removeCategory(token, id)
            toast.success(`Category "${res.data.name}" deleted successfully!`)
            getCategory(token)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Category Management</h1>
            
            {/* Category form */}
            <form className="flex gap-4 mb-6" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="ใส่ชื่อหมวดหมู่สินค้าที่นี่"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                    เพิ่ม
                </button>
            </form>
            
            <hr className="my-4" />
            
            {/* Categories list */}
            <ul className="list-none">
                {categories.map((item, index) => (
                    <li key={item.id} className="flex justify-between items-center py-3 px-4 mb-2 bg-gray-50 rounded-md shadow-sm hover:bg-gray-100">
                        <span className="text-lg font-medium text-gray-700">{item.name}</span>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition duration-200"
                            onClick={() => handleRemove(item.id)}
                        >
                            ลบ
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FormCategory
