class OrderSeller
{
    constructor(data)
    {
        this.id = data.id;
        this.buyerUsername = data.buyerUsername;
        this.timeOfOrder = data.timeOfOrder;
        this.timeForDelivery = data.timeForDelivery;
        this.timeOfArrival = data.timeOfArrival;
        this.address = data.address;
        this.comment = data.comment;
        this.totalPrice = data.totalPrice;
        this.cancelled = data.cancelled;
    }
}
export default OrderSeller;