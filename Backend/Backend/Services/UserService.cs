using AutoMapper;
using Backend.Dto;
using Backend.Infrastracture;
using Backend.Interfaces;
using Backend.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;
using Google.Apis.Auth;
using Backend.Repo;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly ProjectDbContext _dbContext;
        private readonly IConfigurationSection _secretKey;
        private readonly IConfigurationSection _googleClientId;
        private readonly UsersRepo usersRepo;
        public UserService(IMapper mapper, ProjectDbContext dbContext, IConfiguration config)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            usersRepo = new UsersRepo(dbContext);
            _secretKey = config.GetSection("SecretKey");
            _googleClientId = config.GetSection("GoogleClientId");

        }

        public bool ChangePassword(string username, string oldPassword, string newPassword)
        {

            if (username.Trim() == "" || oldPassword.Trim() == "" || newPassword.Trim() == "")
                throw new Exception("Invalid data");
            User u = usersRepo.FindUserByUsername(username); 
            if (u == null)
                throw new Exception("Error");
            if (BCrypt.Net.BCrypt.Verify(oldPassword, u.Password))
            {
                u.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                //_dbContext.Users.Update(u);
                //_dbContext.SaveChanges();
                usersRepo.UpdateUser(u);
                return true;
            }
            else
            {
                throw new Exception("Invalid password!");
            }

        }

        public User EditUser(UserEditDto userEditDto)
        {

            if (userEditDto.Address.Trim() == "" || userEditDto.Email.Trim() == "" || userEditDto.Lastname.Trim() == "" || userEditDto.Username.Trim() == "")
                throw new Exception("Invalid data");

            User u = usersRepo.FindUserByUsername(userEditDto.Username);
            if (u == null)
                throw new Exception("Error");
            u.Lastname = userEditDto.Lastname;
            u.Name = userEditDto.Name;
            u.Birthday = userEditDto.Birthday;
            if (userEditDto.file != null)
            {
                using (var stream = new MemoryStream())
                {
                    userEditDto.file.CopyTo(stream);
                    u.Picture = stream.ToArray();
                }
            }
            u.Address = userEditDto.Address;
            //_dbContext.Users.Update(u);
            //_dbContext.SaveChanges();
            User retVal = usersRepo.UpdateUser(u);
            return retVal;

        }

        public List<GetUserDto> GetSellers()
        {

            List<GetUserDto> retVal = new List<GetUserDto>();
            foreach (User u in usersRepo.GetSellers())
            {
                if (u.UserType == "seller")
                    retVal.Add(_mapper.Map<GetUserDto>(u));
            }
            return retVal;

        }

        public GetUserDto GetUserData(string username)
        {
            if (username.Trim() == "")
                throw new Exception("Invalid data");

            User u = usersRepo.FindUserByUsername(username);
            if (u == null)
                throw new Exception("Error");

                return _mapper.Map<GetUserDto>(u);




        }

        public string Login(UserLoginDto userLoginDto)
        {

            if (userLoginDto.Username.Trim() == "" || userLoginDto.Password.Trim() == "")
                throw new Exception("Invalid data");

            User u = _mapper.Map<User>(userLoginDto);
            //User user = _dbContext.Users.SingleOrDefault(x => x.Username == u.Username);
            User user = usersRepo.FindUserByUsername(userLoginDto.Username);
            if (user == null)
                throw new Exception("Username doesn't exists");

            if (BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.Password))//Uporedjujemo hes pasvorda iz baze i unetog pasvorda
            {
                List<Claim> claims = new List<Claim>();
                if (user.UserType == "admin")
                {
                    claims.Add(new Claim(ClaimTypes.Role, "admin"));
                }
                else if (user.UserType == "buyer")
                {
                    claims.Add(new Claim(ClaimTypes.Role, "buyer"));
                }
                else if (user.UserType == "seller")
                {
                    claims.Add(new Claim(ClaimTypes.Role, "seller"));
                }
                claims.Add(new Claim("verified", user.Verified.ToString()));
                SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: "http://localhost:44306", //url servera koji je izdao token
                    claims: claims, //claimovi
                    expires: DateTime.Now.AddMinutes(20), //vazenje tokena u minutama
                    signingCredentials: signinCredentials //kredencijali za potpis
                );
                string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return tokenString;
            }
            else
            {
                throw new Exception("Invalid password!");

            }


        }

        public  string LoginGoogle(string email,string token)
        {

            try
            {
                GoogleJsonWebSignature.ValidationSettings validationSettings = new GoogleJsonWebSignature.ValidationSettings();
                validationSettings.Audience = new List<string>() { _googleClientId.Value };

                GoogleJsonWebSignature.Payload payload = Task.Run(() => GoogleJsonWebSignature.ValidateAsync(token, validationSettings)).GetAwaiter().GetResult();
            }
            catch(Exception e)
            {
                throw new Exception(e.Message);
            }


            if (email == "")
                throw new Exception("Invalid data");

            //User user = _dbContext.Users.SingleOrDefault(x => x.Email == email);
            User user = usersRepo.FindByEmail(email);
            if (user == null)
                throw new Exception("User with that email doesn't exists");


            List<Claim> claims = new List<Claim>();

            claims.Add(new Claim(ClaimTypes.Role, "buyer"));
            claims.Add(new Claim("username", user.Username));
            claims.Add(new Claim("verified", user.Verified.ToString()));
            SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokeOptions = new JwtSecurityToken(
                issuer: "http://localhost:44306", //url servera koji je izdao token
                claims: claims, //claimovi
                expires: DateTime.Now.AddMinutes(20), //vazenje tokena u minutama
                signingCredentials: signinCredentials //kredencijali za potpis
            );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
            return tokenString;

        }

        public User Register(UserRegisterDto userRegisterDto)
        {

            if (userRegisterDto.Address.Trim() == "" || userRegisterDto.Email.Trim() == "" || userRegisterDto.Lastname.Trim() == "" || userRegisterDto.Username.Trim() == "" || userRegisterDto.file == null)
                throw new Exception("Invalid data");

            if (userRegisterDto.UserType.Trim() != "buyer" && userRegisterDto.UserType.Trim() != "seller")
                throw new Exception("Invalid data");

            User u = _mapper.Map<User>(userRegisterDto);
            //byte[] pictureData;
            using (var stream = new MemoryStream())
            {
                userRegisterDto.file.CopyTo(stream);
                u.Picture = stream.ToArray();
            }
            u.Password = BCrypt.Net.BCrypt.HashPassword(userRegisterDto.Password);
            u.Verified = null;
            /* if(u.UserType.Trim()=="seller")
             {
                 u.Verified = false;
             }
             else
             {
                 u.Verified = null;
             }*/
            //_dbContext.Users.Add(u);
            //_dbContext.SaveChanges();
            User retVal = usersRepo.AddUser(u);
            return retVal;

        }

        public User RegisterUserGoogle(RegisterUserGoogleDto dto)
        {
            string token = dto.Token;
            try
            {
                GoogleJsonWebSignature.ValidationSettings validationSettings = new GoogleJsonWebSignature.ValidationSettings();
                validationSettings.Audience = new List<string>() { _googleClientId.Value };

                GoogleJsonWebSignature.Payload payload = Task.Run(() => GoogleJsonWebSignature.ValidateAsync(token, validationSettings)).GetAwaiter().GetResult();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
            if (dto.Address.Trim() == "" || dto.Email.Trim() == "" || dto.Lastname.Trim() == "" || dto.Username.Trim() == "" || dto.file == null)
                throw new Exception("Invalid data");

            if (dto.UserType.Trim() != "buyer")
                throw new Exception("Invalid data");

            User u = _mapper.Map<User>(dto);
            using (var stream = new MemoryStream())
            {
                dto.file.CopyTo(stream);
                u.Picture = stream.ToArray();
            }
            u.Password = "";

            User retVal = usersRepo.AddUser(u);
            return retVal;

        }

        public bool VerifySeller(string username, bool v)
        {

            if (username.Trim() == "")
                throw new Exception("Invalid data");

            //User user = _dbContext.Users.SingleOrDefault(x => x.Username == username);
            User user = usersRepo.FindUserByUsername(username);
            user.Verified = v;


            MailMessage message = new MailMessage();
            message.From = new MailAddress("web2projekatadm@gmail.com");
            message.To.Add(new MailAddress(user.Email));
            message.Subject = "Verifikacija naloga";
            if (v)
            {
                message.Body = "Vas nalog je uspesno verifikovan.";
            }
            else
            {
                message.Body = "Verifikacija odbijena.";
            }

            
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
            client.EnableSsl = true; // set SSL to true if required
            client.Credentials = new System.Net.NetworkCredential("sotra125@gmail.com", "rrbfbizakitcrzsx");
            
            
            client.Send(message);
            
            _dbContext.Users.Update(user);
            _dbContext.SaveChanges();
            // rrbfbizakitcrzsx
            usersRepo.UpdateUser(user);
            return true;

        }
    }
}
