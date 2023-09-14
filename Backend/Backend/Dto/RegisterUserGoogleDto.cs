using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Dto
{
    public class RegisterUserGoogleDto
    {
        public string Username { get; set; }

        public string Name { get; set; }
        public string Lastname { get; set; }
        public string Password { get; set; }

        public string Address { get; set; }
        public DateTime Birthday { get; set; }
        public string UserType { get; set; }
        public string Email { get; set; }
        public IFormFile file { get; set; }
        public string Token { get; set; }
    }
}
