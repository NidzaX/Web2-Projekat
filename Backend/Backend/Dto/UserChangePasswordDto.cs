using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Dto
{
    public class UserChangePasswordDto
    {
        public string Username { get; set; }
        public string NewPassword { get; set; }

        public string OldPassword { get; set; }

    }
}
