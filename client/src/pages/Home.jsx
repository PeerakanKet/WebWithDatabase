// rafce
import React from "react";
import BestSeller from "../components/home/BestSeller";
import NewProduct from "../components/home/NewProduct";

const Home = () => {
  return (
    <div>

      <p className="text-2xl text-center my-4 font-bold">สินค้าขายดี</p>
      <BestSeller />

      <p className="text-2xl text-center my-4 font-bold">สินค้าใหม่</p>
      <NewProduct />



    </div>
  );
};

export default Home;
