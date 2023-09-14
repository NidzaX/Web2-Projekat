class Order {
    constructor(id, buyerUsername, timeOfOrder, timeForDelivery, timeOfArrival, address, comment, totalPrice, cancelled) {
      this.id = id;
      this.buyerUsername = buyerUsername;
      this.timeOfOrder = timeOfOrder;
      this.timeForDelivery = timeForDelivery;
      this.timeOfArrival = timeOfArrival;
      this.address = address;
      this.comment = comment;
      this.totalPrice = totalPrice;
      this.cancelled = cancelled;
      this.status = '';
    }
  
    compareDates(date1) {
      const Date1 = new Date(date1);
      const Date2 = new Date();
      return Date1 > Date2;
    }
  
    getDateTime(date) {
      const date1 = new Date(date);
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      return date1.toLocaleString('en-GB', options);
    }
  
    getOrderStatus() {
      if (this.cancelled) {
        this.status = 'Cancelled';
        return 'Cancelled';
      } else if (!this.cancelled && this.compareDates(this.timeOfArrival)) {
        this.status = 'In progress';
        return 'In progress';
      } else if (!this.cancelled && !this.compareDates(this.timeOfArrival)) {
        this.status = 'Delivered';
        return 'Delivered';
      }
    }
  }
  export default Order;