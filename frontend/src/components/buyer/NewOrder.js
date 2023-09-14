import { useEffect, useState } from "react";
import { GetAllProducts } from "../../services/productService";
import Cart from "../buyer/Cart";
import "bootstrap/dist/css/bootstrap.css";
import Product from "../model/Product";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

function NewOrder() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);


  function findIndex(itemId) {
    const index = cartItems.findIndex((item) => item.product.id === itemId);
    return index;
  }

  function removeItem(itemId) {
    const i = findIndex(itemId);
    const list = cartItems;
    list.splice(i, 1);
    setCartItems(list);
  }

  function AddToCart(event, product) {
    event.preventDefault();
    const i = findIndex(product.id);
    if (i === -1) {
      const item = {
        product: product,
        orderQuantity: event.target.quantity.value,
      };
      setCartItems((items) => [...items, item]);
    } else {
      const item = cartItems[i];
      item.orderQuantity = +item.orderQuantity + +event.target.quantity.value;
      cartItems[i] = item;
    }
  }

  useEffect(() => {
    const getProducts = async () => {
      const resp = await GetAllProducts();
      const mappedProducts = resp.data.map((product) => new Product(product));
      console.log(mappedProducts);
      setProducts(mappedProducts);
    };
    getProducts();
  }, []);

  function ShowProduct(props) {
    const product = props.product;
    const imgUrl = `data:image/png;base64,${product.picture}`;
    if (product.quantity === 0) return null;
    return (
      <Card className="product-card mb-3" style={{ width: "16rem",height:"100%"}} >
        <Card.Img variant="top" src={imgUrl} style={{height: "250px",objectFit:"fill"}} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text>Price: {product.price}</Card.Text>
          <Card.Text>In stock: {product.quantity}</Card.Text>
          {!isCartOpen && product.quantity > 0 && (
            <div className="d-flex justify-content-center align-items-center">
              <form onSubmit={(event) => AddToCart(event, product)}>
                <input type="number" style={{width:"130px"}} defaultValue={1} min={1} max={product.quantity} name="quantity" className="mr-2" />
                <br></br>
                <Button variant="outline-dark" type="submit" className="mt-3">
                  Add to cart
                </Button>
              </form>
            </div>
          )}
          {isCartOpen && product.quantity > 0 && (
            <div className="d-flex justify-content-center align-items-center">
            <form >
              <input type="number" defaultValue={1} min={1} max={product.quantity} name="quantity" className="mr-2" />
              <Button variant="outline-dark" type="submit" className="mt-3" disabled>
                Add to cart
              </Button>
            </form>
          </div>
          )}
        </Card.Body>
      </Card>
    );
  }

  return (
    <Container>
      <Row xs={1} md={2} lg={3} xl={4} className="g-4 mt-1">
        {Array.from(products).map((product) => (
          <Col key={product.id}>
            <ShowProduct product={product} />
          </Col>
        ))}
      </Row>
      <div className="text-center mt-3 position-sticky" style={{  position: "sticky",bottom: "20px",right: "20px",zIndex: "1000",textAlign: "center"}}>
        <Button variant="dark" onClick={() => setIsCartOpen(true)}>
          View Cart ({cartItems.length})
        </Button>
        {isCartOpen && (
          <Cart items={cartItems} onClearCart={() => setCartItems([])} onClose={() => setIsCartOpen(false)} removeItem={removeItem} />
        )}
      </div>
    </Container>
  );
}

export default NewOrder;
