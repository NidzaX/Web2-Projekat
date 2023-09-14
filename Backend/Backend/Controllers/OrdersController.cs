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
    [Route("api/orders")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrdersService _ordersService;
        public OrdersController(IOrdersService ordersService)
        {
            _ordersService = ordersService;
        }
        [HttpPost("addOrder")]
        [Authorize(Roles = "buyer")]
        public ActionResult AddOrder(NewOrderProductDto dto)
        {
            try
            {
                return Ok(_ordersService.AddOrder(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getAllOrders")]
        [Authorize(Roles = "admin")]
        public ActionResult GetAllOrders()
        {
            try
            {
                return Ok(_ordersService.GetAllOrders());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getAllOrdersBuyer")]
        [Authorize(Roles = "buyer")]
        public ActionResult GetAllOrdersBuyer(string buyer)
        {
            try
            {
                return Ok(_ordersService.GetAllOrdersBuyer(buyer));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("cancel/{orderId}")]
        [Authorize(Roles = "buyer")]
        public ActionResult CancelOrder(long orderId)
        {
            try
            {
                return Ok(_ordersService.CancelOrder(orderId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getOrderDetailsAdmin/{orderId}")]
        [Authorize(Roles = "admin,buyer")]
        public ActionResult GetOrderDetailsAdmin(long orderId)
        {
            try
            {
                return Ok(_ordersService.GetOrderDetailsAdmin(orderId));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getAllOrdersSeller")]
        [Authorize(Roles = "seller")]
        public ActionResult GetAllOrdersSeller(string seller)
        {
            try
            {
                return Ok(_ordersService.GetAllOrdersSeller(seller));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getOrderDetailsSeller/{orderId}/{seller}")]
        [Authorize(Roles = "seller")]
        public ActionResult GetOrderDetailsSeller(long orderId, string seller)
        {
            try
            {
                return Ok(_ordersService.GetOrderDetailsSeller(orderId, seller));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        //[HttpGet("getOrderDetailsBuyer/{orderId}")]
        //[Authorize(Roles = "buyer")]
        //public ActionResult GetOrderDetailsBuyer(long orderId)
        //{
        //    return Ok(_ordersService.GetOrderDetailsBuyer(orderId));
        //}
    }
}
