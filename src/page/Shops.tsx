// src/pages/Shops.tsx
import { useEffect, useState } from "react";
import API from "../api";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Shop {
  id: number;
  name: string;
  location: string;
  products: Product[];
}

function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);

  useEffect(() => {
    API.get<Shop[]>("/shops").then(res => setShops(res.data));
  }, []);

  const addToCart = (productId: number) => {
    API.post("/cart", { product_id: productId, quantity: 1 })
      .then(() => alert("Товар добавлен в корзину"))
      .catch(() => alert("Ошибка при добавлении"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Магазины</h1>
      {shops.map(shop => (
        <div key={shop.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h2>{shop.name}</h2>
          <p>{shop.location}</p>
          <ul>
            {shop.products.map(product => (
              <li key={product.id}>
                {product.name} — {product.price}$
                <button onClick={() => addToCart(product.id)} style={{ marginLeft: "10px" }}>
                  Добавить в корзину
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Shops;
