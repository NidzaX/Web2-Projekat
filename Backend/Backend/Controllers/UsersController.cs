using Backend.Dto;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm] UserRegisterDto dto)
        {
            try
            {
                return Ok(_userService.Register(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost("login")]
        public IActionResult Login([FromForm] UserLoginDto dto)
        {
            try
            {
                return Ok(_userService.Login(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getUserData")]
        public IActionResult getUserData([FromQuery] string username)
        {
            try
            {
                return Ok(_userService.GetUserData(username));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("updateProfile")]
        public IActionResult updateProfile([FromForm] UserEditDto dto)
        {
            try
            {
                return Ok(_userService.EditUser(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getSellers")]
        [Authorize(Roles = "admin")]
        public IActionResult getSellers()
        {
            try
            {
                return Ok(_userService.GetSellers());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("verify/{username}/{v}")]
        //[Authorize(Policy ="AdminPolicy")]
        [Authorize(Roles = "admin")]
        public ActionResult VerifyUser(string username, bool v)
        {
            try
            {
                return Ok(_userService.VerifySeller(username, v));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("changePassword")]
        public ActionResult ChangePassword([FromForm] UserChangePasswordDto dto)
        {
            try
            {
                return Ok(_userService.ChangePassword(dto.Username, dto.OldPassword, dto.NewPassword));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost("registerGoogleUser")]
        public ActionResult RegisterGoogleUser([FromForm] RegisterUserGoogleDto dto)
        {
            try
            {
                return Ok(_userService.RegisterUserGoogle(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPost("loginGoogle")]
        public ActionResult LoginGoogleUser([FromForm] GoogleLoginDto dto)
        {
            try
            {
                return Ok(_userService.LoginGoogle(dto.Email,dto.Token));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
