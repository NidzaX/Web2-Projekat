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
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsService _productService;
        public ProductsController(IProductsService productService)
        {
            _productService = productService;
        }
        [HttpPost("addProduct")]
        [Authorize(Roles = "seller")]
        public ActionResult AddProduct([FromForm] AddProductDto dto)
        {
            try
            {
                return Ok(_productService.AddProduct(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getProductsBySeller")]
        [Authorize(Roles = "seller")]
        public ActionResult GetProductsBySeller(string seller)
        {
            try
            {
                return Ok(_productService.GetProductsBySeller(seller));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpPut("editProduct")]
        [Authorize(Roles = "seller")]
        public ActionResult EditProduct([FromForm] EditProductDto dto)
        {
            try
            {
                return Ok(_productService.EditProduct(dto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpDelete("deleteProduct/{id}")]
        [Authorize(Roles = "seller")]
        public ActionResult DeleteProduct(long id)
        {
            try
            {
                return Ok(_productService.DeleteProduct(id));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
        [HttpGet("getAllProducts")]
        [Authorize(Roles = "buyer")]
        public ActionResult GetAllProducts()
        {
            try
            {
                return Ok(_productService.GetAllProducts());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
