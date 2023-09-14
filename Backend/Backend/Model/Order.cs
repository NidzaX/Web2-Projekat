using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Model
{
    public class Order
    {
        public long Id { get; set; }
        //public List<Product> Products { get; set; }
        public long BuyerId { get; set; }
        public User Buyer { get; set; }
        public DateTime TimeOfOrder { get; set; }
        public string Address { get; set; }
        public string Comment { get; set; }
        public int TotalPrice { get; set; }
        public int TimeForDelivery { get; set; }
        public List<OrderedProduct> OrderedProducts { get; set; }
        public bool Cancelled { get; set; }
        public string BuyerUsername { get; set; }
    }
}
