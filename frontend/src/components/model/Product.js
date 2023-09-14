class Product {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.price = data.price;
      this.quantity = data.quantity;
      this.description = data.description;
      this.picture = data.picture;
      this.ownerid = data.ownerId;
    }
  }
export default Product;