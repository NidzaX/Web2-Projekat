using Backend.Dto;
using Backend.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IUserService
    {
        User Register(UserRegisterDto userRegisterDto);

        string Login(UserLoginDto userLoginDto);

        GetUserDto GetUserData(string username);

        User EditUser(UserEditDto userEditDto);

        List<GetUserDto> GetSellers();

        bool VerifySeller(string username,bool v);

        bool ChangePassword(string username,string oldPassword,string newPassword);

        User RegisterUserGoogle(RegisterUserGoogleDto dto);
        string LoginGoogle(string email,string token);
    }
}
