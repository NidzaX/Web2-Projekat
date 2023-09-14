using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Dto
{
    public class GetAllOrdersDto
    {
        public long Id { get; set; }
        public string BuyerUsername { get; set; }
        public DateTime TimeOfOrder { get; set; }
        public int TimeForDelivery { get; set; }
        public string Address { get; set; }
        public string Comment { get; set; }
        public int TotalPrice { get; set; }
        public bool Cancelled { get; set; }
        public DateTime TimeOfArrival { get; set; }
    }
}
