import React from "react";

const Kindergarten = () => {
  console.log("Kindergarten component is rendering - MINIMAL VERSION");
  
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-center">Детский сад</h1>
      <p className="text-center mt-4">Страница детского сада загружается!</p>
    </div>
  );
};

export default Kindergarten;