import { useEffect, useState } from "react";
import API from "../api";

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  image?: string; // добавим фото для плитки
}

function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");      
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Загружаем корзину
  useEffect(() => {
    API.get<CartItem[]>("/cart").then(res => setItems(res.data));
  }, []);

  const removeItem = (id: number) => {
    API.delete(`/cart/${id}`).then(() => {
      setItems(prev => prev.filter(item => item.id !== id));
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    API.put(`/cart/${id}`, { quantity }).then(res => {
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: res.data.quantity } : item
        )
      );
    });
  };

  const checkout = () => {
    if (!name || !email || !phone || !address) {
      alert("Заполните все поля!");
      return;
    }

    const payload = {
      name,
      email,
      phone,
      address,
      items: items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    };

    API.post("/cart/checkout", payload)
      .then(() => {
        alert("Заказ оформлен!");
        setItems([]);
        setName(""); setEmail(""); setPhone(""); setAddress("");
      })
      .catch(err => {
        console.error(err);
        alert("Ошибка при оформлении заказа");
      });
  };

  const totalPrice = items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

  return (
    <div className="cart-page">
      <div className="top-nav">
        <button onClick={() => window.location.href = "/shops"}>Back to Shops</button>
      </div>

      <div className="cart-container">
        {/* Левая панель с формой */}
        <div className="cart-form">
          <h2>Customer Info</h2>
          <label>Name:</label>
          <input value={name} onChange={e => setName(e.target.value)} />
          <label>Email:</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
          <label>Phone:</label>
          <input value={phone} onChange={e => setPhone(e.target.value)} />
          <label>Address:</label>
          <input value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        {/* Правая панель с товарами */}
        <div className="cart-products">
          {items.map(item => (
            <div key={item.id} className="product-card">
              {item.image && <img src={item.image} alt={item.product_name} />}
              <h3>{item.product_name}</h3>
              <div className="quantity-control">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <p>{item.product_price * item.quantity}$</p>
              <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
            </div>
          ))}

          {items.length > 0 && (
            <div className="cart-footer">
              <h3>Total Price: {totalPrice}$</h3>
              <button onClick={checkout}>Submit Order</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
