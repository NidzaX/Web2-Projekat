using AutoMapper;
using Backend.Dto;
using Backend.Infrastracture;
using Backend.Interfaces;
using Backend.Model;
using Backend.Repo;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class ProductsService : IProductsService
    {
        private readonly IMapper _mapper;
        private readonly ProjectDbContext _dbContext;
        private readonly ProductsRepo productsRepo;
        private readonly UsersRepo usersRepo;
        public ProductsService(IMapper mapper, ProjectDbContext dbContext)
        {
            _mapper = mapper;
            //_dbContext = dbContext;
            productsRepo = new ProductsRepo(dbContext);
            usersRepo = new UsersRepo(dbContext);
        }

        public Product AddProduct(AddProductDto dto)
        {

            if (dto.Description.Trim() == "" || dto.file == null || dto.Name.Trim() == "" || dto.Quantity <= 0 || dto.SellerUsername.Trim() == "")
                throw new Exception("Invalid Data!");
            Product p = _mapper.Map<Product>(dto);
            using (var stream = new MemoryStream())
            {
                dto.file.CopyTo(stream);
                p.Picture = stream.ToArray();
            }
            //User owner = _dbContext.Users.SingleOrDefault(x => x.Username == dto.SellerUsername);
            User owner = usersRepo.FindUserByUsername(dto.SellerUsername);
            p.Owner = owner;
            p.OwnerId = owner.Id;
            //_dbContext.Products.Add(p);
            //_dbContext.SaveChanges();
            Product retval = productsRepo.AddProduct(p);
            return retval;

        }

        public bool DeleteProduct(long id)
        {

            if (id <= 0)
                throw new Exception("Invalid productId!");
            //Product p = _dbContext.Products.Where(x => x.Id == id).FirstOrDefault();
            Product p = productsRepo.FindProduct(id);
            //_dbContext.Remove(p);
            //_dbContext.SaveChanges();
            productsRepo.RemoveProduct(p);
            return true;

        }

        public Product EditProduct(EditProductDto dto)
        {

            if (dto.Name.Trim() == "" || dto.Price <= 0 || dto.Quantity <= 0 || dto.Id <= 0)
                throw new Exception("Invalid data!");

            //Product p = _dbContext.Products.Find(dto.Id);
            Product p = productsRepo.FindProduct(dto.Id);
            p.Name = dto.Name;
            p.Description = dto.Description;
            p.Quantity = dto.Quantity;
            p.Price = dto.Price;
            if (dto.file != null)
            {
                using (var stream = new MemoryStream())
                {
                    dto.file.CopyTo(stream);
                    p.Picture = stream.ToArray();
                }
            }
            //_dbContext.Products.Update(p);
            //_dbContext.SaveChanges();
            Product retVal = productsRepo.UpdateProduct(p);
            return retVal;

        }

        public List<GetProductsDto> GetAllProducts()
        {

            //List<Product> list = _dbContext.Products.ToList<Product>();
            List<Product> list = productsRepo.GetAllProducts();
            List<GetProductsDto> retVal = new List<GetProductsDto>();
            foreach (var item in list)
            {
                retVal.Add(_mapper.Map<GetProductsDto>(item));
            }
            return retVal;


        }

        public List<GetProductsDto> GetProductsBySeller(string seller)
        {
            if (seller.Trim() == "")
                throw new Exception("Invalid seller!");

            //User owner = _dbContext.Users.SingleOrDefault(x => x.Username == seller);
            User owner = usersRepo.FindUserByUsername(seller);
            if (owner == null)
                throw new Exception("error");
            List<Product> products = productsRepo.GetAllProducts().Where(x => x.OwnerId == owner.Id).ToList<Product>();
            List<GetProductsDto> retVal = new List<GetProductsDto>();
            foreach (var item in products)
            {
                GetProductsDto dto = _mapper.Map<GetProductsDto>(item);
                retVal.Add(dto);
            }
            return retVal;


        }
    }
}
