using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Backend.Model
{
    public class User
    {
        public long Id { get; set; }
        public string Username { get; set; }

        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Password { get; set; }

        public string Address { get; set; }
        public DateTime Birthday { get; set; }
        public string UserType { get; set; }
        public string Email { get; set; }
        public byte[] Picture { get; set; } 
        public bool? Verified { get; set; }

        public List<Product> Products { get; set; }
        public List<Order> Orders { get; set; }

    }
}
