import Button from "../shared/Button";
import { useCartContext } from "../shared/CartContext";

function Header() {
  const { products } = useCartContext();

  return (
    <header>
      <h1 className="title">Dummy Online Shop</h1>
      <Button onClick={() => {}}>Cart ({products.length})</Button>
    </header>
  );
}

export default Header;
