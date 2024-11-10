import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { numberFormat } from "../../utils/number";

const SearchCard = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const products = useEcomStore((state) => state.products);
  const actionSearchFilters = useEcomStore(
    (state) => state.actionSearchFilters
  );

  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [text, setText] = useState("");
  const [categorySelected, setCategorySelected] = useState([]);

  const [price, setPrice] = useState([1000, 30000]);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    getCategory();
  }, []);

  // Step 1: Search Text
  useEffect(() => {
    const delay = setTimeout(() => {
      if (text) {
        actionSearchFilters({ query: text });
      } else {
        getProduct();
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [text]);

  // Step 2: Search by Category
  const handleCheck = (e) => {
    const inCheck = e.target.value;
    const inState = [...categorySelected];
    const findCheck = inState.indexOf(inCheck);

    if (findCheck === -1) {
      inState.push(inCheck);
    } else {
      inState.splice(findCheck, 1);
    }
    setCategorySelected(inState);

    if (inState.length > 0) {
      actionSearchFilters({ category: inState });
    } else {
      getProduct();
    }
  };

  // Step 3: Search by Price
  useEffect(() => {
    actionSearchFilters({ price });
  }, [ok]);

  const handlePrice = (value) => {
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">ค้นหาสินค้า</h1>

      {/* Search by Text */}
      <div className="mb-6">
        <input
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="ค้นหาสินค้า...."
          className="border rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <hr className="my-4" />

      {/* Search by Category */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg text-gray-800 mb-2">หมวดหมู่สินค้า</h2>
        <div className="space-y-2">
          {categories.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                onChange={handleCheck}
                value={item.id}
                type="checkbox"
                className="rounded-md"
              />
              <label className="text-gray-700">{item.name}</label>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-4" />

      {/* Search by Price */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg text-gray-800 mb-2">ค้นหาราคา</h2>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Min: {numberFormat(price[0])}</span>
            <span>Max: {numberFormat(price[1])}</span>
          </div>

          <Slider
            onChange={handlePrice}
            range
            min={0}
            max={1000}
            defaultValue={[0, 1000]}
            step={1}
            trackStyle={{ backgroundColor: "#4CAF50", height: 8 }}
            railStyle={{ backgroundColor: "#ddd", height: 8 }}
            handleStyle={{
              backgroundColor: "#4CAF50",
              borderColor: "#4CAF50",
              height: 24,
              width: 24,
              marginTop: -8,  // Centers the handle vertically on the track
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)", // Optional shadow for a better look
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
