import { useEffect, useState } from "react";
import API from "../api";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string; 
}

interface Shop {
  id: number;
  name: string;
  location: string;
  products: Product[];
}

function Shops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [message, setMessage] = useState(""); // уведомление

  useEffect(() => {
    API.get<Shop[]>("/shops").then(res => {
      setShops(res.data);
      if (res.data.length > 0) setSelectedShop(res.data[0]);
    });
  }, []);

  const addToCart = (productId: number) => {
    API.post("/cart", { product_id: productId, quantity: 1 })
      .then(() => {
        setMessage("Item added to cart!");
        setTimeout(() => setMessage(""), 2000); // сообщение пропадет через 2 сек
      })
      .catch(() => {
        setMessage("Error adding to cart");
        setTimeout(() => setMessage(""), 2000);
      });
  };

  return (
    <div className="shops-page">
      {/* Навигация сверху */}
      <div className="top-nav">
        <button onClick={() => window.location.href = "/shops"}>Shops</button>
        <button onClick={() => window.location.href = "/cart"}>Shopping Cart</button>
      </div>

      <div className="shops-container">
        {/* Левый столбец с магазинами */}
        <div className="shop-list">
          {shops.map(shop => (
            <button
              key={shop.id}
              className={selectedShop?.id === shop.id ? "selected" : ""}
              onClick={() => setSelectedShop(shop)}
            >
              <b>{shop.name}</b>
              <p>{shop.location}</p>
            </button>
          ))}
        </div>

        {/* Правый столбец с плитками товаров */}
        <div className="product-grid">
          {selectedShop?.products.map(product => (
            <div key={product.id} className="product-card">
              {product.image && <img src={product.image} alt={product.name} />}
              <h3>{product.name}</h3>
              <p>{product.price}$</p>
              <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            </div>
          ))}
        </div>
      </div>

      {/* Уведомление */}
      {message && <div className="notification">{message}</div>}
    </div>
  );
}

export default Shops;
