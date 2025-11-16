import Button from "../shared/Button";
import { useCartContext } from "../shared/CartContext";

const ProductItem = ({ product }) => {
  const { addProduct } = useCartContext();

  return (
    <div className="product-card">
      <div style={{ flex: 1 }}>
        <h3>{product.product_name}</h3>
        <p>
          <strong>Category:</strong> {product.category}
        </p>
        <p>{product.description}</p>
        <p>
          <strong>Price:</strong> {product.price}
        </p>
      </div>
      <div>
        <Button text="Add to Cart" onClick={() => addProduct(product)} />
      </div>
    </div>
  );
};

export default ProductItem;
