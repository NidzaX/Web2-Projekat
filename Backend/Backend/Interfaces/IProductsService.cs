using Backend.Dto;
using Backend.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IProductsService
    {
        Product AddProduct(AddProductDto dto);
        List<GetProductsDto> GetProductsBySeller(string seller);
        Product EditProduct(EditProductDto dto);
        bool DeleteProduct(long id);
        List<GetProductsDto> GetAllProducts();
    }
}
