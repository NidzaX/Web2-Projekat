using AutoMapper;
using Backend.Dto;
using Backend.Infrastracture;
using Backend.Interfaces;
using Backend.Model;
using Backend.Repo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class OrdersService : IOrdersService
    {
        private readonly IMapper _mapper;
        private readonly ProjectDbContext _dbContext;
        private readonly UsersRepo usersRepo;
        private readonly OrdersRepo ordersRepo;
        private readonly ProductsRepo productsRepo;
        private readonly OrderedProductsRepo orderedProductsRepo;


        public OrdersService(IMapper mapper, ProjectDbContext dbContext)
        {
            _mapper = mapper;
            usersRepo = new UsersRepo(dbContext);
            ordersRepo = new OrdersRepo(dbContext);
            orderedProductsRepo = new OrderedProductsRepo(dbContext);
            productsRepo = new ProductsRepo(dbContext);
        }
        public int AddOrder(NewOrderProductDto dto)
        {
            if (dto.BuyerUsername.Trim() == "")
                throw new Exception("Invalid buyer!");

            if (dto.Products.Count == 0)
                throw new Exception("Invalid products count!");

            if (dto.TotalPrice <= 0)
                throw new Exception("Invalid price!");

            List<OrderedProduct> orderedProducts = new List<OrderedProduct>();
            // User u = _dbContext.Users.SingleOrDefault(x => x.Username == dto.BuyerUsername);
            User u = usersRepo.FindUserByUsername(dto.BuyerUsername);
            if (u == null)
                throw new Exception("Error");
            foreach (var item in dto.Products)
            {
                //Product p = _dbContext.Products.Find(item.ProductId);
                Product p = productsRepo.FindProduct(item.ProductId);
                if (p.Quantity < item.OrderQuantity)
                    throw new Exception("There is not enough of this product in stock!");
                p.Quantity -= item.OrderQuantity;
                //_dbContext.Update(p);
                productsRepo.UpdateProduct(p);
                OrderedProduct orderedProduct = new OrderedProduct();
                orderedProduct.ProductId = p.Id;
                orderedProduct.OrderQuantity = item.OrderQuantity;
                orderedProducts.Add(orderedProduct);
            }
            Order o = new Order();
            Random random = new Random();
            int deliveryTime = random.Next(2, 72);
            o.TimeForDelivery = deliveryTime;
            o.TimeOfOrder = DateTime.Now;
            o.TotalPrice = dto.TotalPrice;
            o.BuyerId = u.Id;
            o.Address = dto.Address;
            o.Comment = dto.Comment;
            o.BuyerUsername = dto.BuyerUsername;
            //_dbContext.Orders.Add(o);
            //_dbContext.SaveChanges();
            Order order = ordersRepo.AddOrder(o);
            foreach (var item in orderedProducts)
            {
                item.OrderId = order.Id;
                //_dbContext.OrderedProducts.Add(item);
                orderedProductsRepo.AddOrderedProduct(item);
            }
            //_dbContext.SaveChanges();
            return deliveryTime;
        }

        public bool CancelOrder(long orderId)
        {

            if (orderId <= 0)
                throw new Exception("Invalid price!");

            //Order o = _dbContext.Orders.Find(orderId);
            Order o = ordersRepo.FindOrder(orderId);
            o.Cancelled = true;
            //_dbContext.Orders.Update(o);
            ordersRepo.UpdateOrder(o);
            //List<OrderedProduct> orderedProducts = _dbContext.OrderedProducts.ToList<OrderedProduct>();
            List<OrderedProduct> orderedProducts = orderedProductsRepo.GetAll();
            foreach (var item in orderedProducts)
            {
                if (item.OrderId == orderId)
                {
                    //Product p = _dbContext.Products.Find(item.ProductId);
                    Product p = productsRepo.FindProduct(item.ProductId);
                    p.Quantity += item.OrderQuantity;
                    // _dbContext.Products.Update(p);
                    productsRepo.UpdateProduct(p);
                }
            }
            //_dbContext.SaveChanges();
            return true;


        }

        public List<GetAllOrdersDto> GetAllOrders()
        {

            List<GetAllOrdersDto> retVal = new List<GetAllOrdersDto>();
            foreach (var item in ordersRepo.GetAll())
            {
                GetAllOrdersDto gao = new GetAllOrdersDto();
                gao = _mapper.Map<GetAllOrdersDto>(item);
                gao.TimeOfArrival = item.TimeOfOrder.AddHours(item.TimeForDelivery);
                //gao.BuyerUsername = item.BuyerUsername;
                retVal.Add(gao);
                //retVal.Add(_mapper.Map<GetAllOrdersDto>(item));
            }
            return retVal;

        }

        public List<GetAllOrdersBuyerDto> GetAllOrdersBuyer(string buyer)
        {
            if (buyer.Trim() == "")
                throw new Exception("Invalid buyer!");
            List<GetAllOrdersBuyerDto> retVal = new List<GetAllOrdersBuyerDto>();
            foreach (var item in ordersRepo.GetAll())
            {
                if (!item.Cancelled && item.BuyerUsername == buyer)
                {
                    GetAllOrdersBuyerDto gao = new GetAllOrdersBuyerDto();
                    gao = _mapper.Map<GetAllOrdersBuyerDto>(item);
                    gao.TimeOfArrival = item.TimeOfOrder.AddHours(item.TimeForDelivery);
                    retVal.Add(gao);
                }
            }
            return retVal;
        }

        public List<GetAllOrdersDto> GetAllOrdersSeller(string seller)
        {

            if (seller.Trim() == "")
                throw new Exception("Invalid seller!");

            List<GetAllOrdersDto> retVal = new List<GetAllOrdersDto>();
            //long userId = _dbContext.Users.SingleOrDefault(x => x.Username == seller).Id;
            long userId = usersRepo.FindUserByUsername(seller).Id;
            //List<Product> products = _dbContext.Products.Where(x => x.OwnerId == userId).ToList<Product>();
            List<Product> products = productsRepo.GetAllProducts().Where(x => x.OwnerId == userId).ToList<Product>();

            //List<OrderedProduct> orderedProducts = _dbContext.OrderedProducts.ToList<OrderedProduct>();
            List<OrderedProduct> orderedProducts = orderedProductsRepo.GetAll();

            List<long> OrderIds = new List<long>();
            foreach (var item in orderedProducts)
            {
                foreach (var item2 in products)
                {
                    if (item.ProductId == item2.Id)
                        OrderIds.Add(item.OrderId);
                }
            }
            OrderIds = OrderIds.Distinct().ToList();
            foreach (var item in ordersRepo.GetAll())
            {
                if (OrderIds.Contains(item.Id))
                {
                    GetAllOrdersDto gao = new GetAllOrdersDto();
                    gao = _mapper.Map<GetAllOrdersDto>(item);
                    gao.TimeOfArrival = item.TimeOfOrder.AddHours(item.TimeForDelivery);
                    retVal.Add(gao);
                }
            }
            return retVal;
        }

        public List<GetOrderDetailsProductDto> GetOrderDetailsAdmin(long orderId)
        {

            if (orderId <= 0)
                throw new Exception("Invalid orderId!");

            List<GetOrderDetailsProductDto> retVal = new List<GetOrderDetailsProductDto>();
            Dictionary<long, int> IdsQuantites = new Dictionary<long, int>();
            foreach (var item in orderedProductsRepo.GetAll())
            {
                if (item.OrderId == orderId)
                {
                    IdsQuantites[item.ProductId] = item.OrderQuantity;
                }
            }
            foreach (var item in IdsQuantites)
            {
                //GetOrderDetailsProductDto temp = _mapper.Map<GetOrderDetailsProductDto>(_dbContext.Products.Find(item.Key));
                GetOrderDetailsProductDto temp = _mapper.Map<GetOrderDetailsProductDto>(productsRepo.FindProduct(item.Key));

                temp.Quantity = item.Value;
                retVal.Add(temp);
            }
            return retVal;

        }

        public List<GetOrderDetailsProductDto> GetOrderDetailsBuyer(long orderId)
        {

            if (orderId <= 0)
                throw new Exception("Invalid orderId!");

            List<GetOrderDetailsProductDto> retVal = new List<GetOrderDetailsProductDto>();
            Dictionary<long, int> IdsQuantites = new Dictionary<long, int>();
            foreach (var item in orderedProductsRepo.GetAll())
            {
                if (item.OrderId == orderId)
                {
                    IdsQuantites[item.ProductId] = item.OrderQuantity;
                }
            }
            foreach (var item in IdsQuantites)
            {
                //GetOrderDetailsProductDto temp = _mapper.Map<GetOrderDetailsProductDto>(_dbContext.Products.Find(item.Key));
                GetOrderDetailsProductDto temp = _mapper.Map<GetOrderDetailsProductDto>(productsRepo.FindProduct(item.Key));

                temp.Quantity = item.Value;
                retVal.Add(temp);
            }
            return retVal;

        }

        public List<GetOrderDetailsProductDtoSeller> GetOrderDetailsSeller(long orderId, string username)
        {

            if (orderId <= 0 || username.Trim() == "")
                throw new Exception("Invalid data!");

            List<GetOrderDetailsProductDtoSeller> retVal = new List<GetOrderDetailsProductDtoSeller>();
            Dictionary<long, int> IdsQuantites = new Dictionary<long, int>();
            //long userId = _dbContext.Users.SingleOrDefault(x => x.Username == username).Id;
            long userId = usersRepo.FindUserByUsername(username).Id;
            //List<Product> products = _dbContext.Products.Where(x => x.OwnerId == userId).ToList<Product>();
            List<Product> products = productsRepo.GetAllProducts().Where(x => x.OwnerId == userId).ToList<Product>();

            foreach (var item in orderedProductsRepo.GetAll())
            {
                if (item.OrderId == orderId)
                {
                    IdsQuantites[item.ProductId] = item.OrderQuantity;
                }
            }
            foreach (var item in IdsQuantites)
            {
                foreach (var item2 in products)
                {
                    if (item2.Id == item.Key)
                    {
                        GetOrderDetailsProductDtoSeller temp = _mapper.Map<GetOrderDetailsProductDtoSeller>(item2);
                        temp.OrderQuantity = item.Value;
                        retVal.Add(temp);
                    }
                }
            }
            return retVal;

        }
    }
}
