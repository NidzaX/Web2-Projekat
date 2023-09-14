using AutoMapper;
using Backend.Dto;
using Backend.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Mapping
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserRegisterDto>().ReverseMap();
            CreateMap<User, UserLoginDto>().ReverseMap();
            CreateMap<User, UserEditDto>().ReverseMap();
            CreateMap<User, GetUserDto>().ReverseMap();
            CreateMap<Product, AddProductDto>().ReverseMap();
            CreateMap<Product, GetProductsDto>().ReverseMap();
            CreateMap<Product, EditProductDto>().ReverseMap();
            CreateMap<Order, GetAllOrdersDto>().ReverseMap();
            CreateMap<Order, GetAllOrdersBuyerDto>().ReverseMap();
            CreateMap<Product, GetOrderDetailsProductDto>().ReverseMap();
            CreateMap<Product, GetOrderDetailsProductDtoSeller>().ReverseMap();
            CreateMap<User, RegisterUserGoogleDto>().ReverseMap();
        }
    }
}
