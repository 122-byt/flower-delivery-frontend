import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Shops from "./page/Shops";
import Cart from "./page/Cart";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <Link to="/shops" style={{ marginRight: "10px" }}>Магазины</Link>
        <Link to="/cart">Корзина</Link>
      </nav>
      <Routes>
        <Route path="/shops" element={<Shops />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
}

export default App;
