import { useEffect, useState } from "react";
import API from "../api";

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
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

  // Удалить товар
  const removeItem = (id: number) => {
    API.delete(`/cart/${id}`).then(() => {
      setItems(prev => prev.filter(item => item.id !== id));
    });
  };

  // Обновить количество
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

  // Оформить заказ
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Корзина</h1>

      {items.length === 0 && <p>Корзина пуста</p>}

      {items.map(item => (
        <div key={item.id} style={{ borderBottom: "1px solid #ccc", padding: "10px" }}>
          <b>{item.product_name}</b> — {item.product_price}$ × {item.quantity}
          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ marginLeft: "10px" }}>+</button>
          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
          <button onClick={() => removeItem(item.id)} style={{ marginLeft: "10px", color: "red" }}>Удалить</button>
        </div>
      ))}

      {items.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Оформление заказа</h2>
          <input placeholder="Имя" value={name} onChange={e => setName(e.target.value)} /><br />
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
          <input placeholder="Телефон" value={phone} onChange={e => setPhone(e.target.value)} /><br />
          <input placeholder="Адрес" value={address} onChange={e => setAddress(e.target.value)} /><br />
          <button onClick={checkout} style={{ marginTop: "10px" }}>Отправить заказ</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
