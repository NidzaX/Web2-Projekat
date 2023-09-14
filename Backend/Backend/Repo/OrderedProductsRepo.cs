using Backend.Infrastracture;
using Backend.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repo
{
    public class OrderedProductsRepo
    {
        private ProjectDbContext projectDbContext;
        public OrderedProductsRepo(ProjectDbContext context)
        {
            projectDbContext = context;
        }
        public OrderedProduct AddOrderedProduct(OrderedProduct op)
        {
            OrderedProduct retVal = projectDbContext.OrderedProducts.Add(op).Entity;
            projectDbContext.SaveChanges();
            return retVal;
        }
        public List<OrderedProduct> GetAll()
        {
            return projectDbContext.OrderedProducts.ToList<OrderedProduct>();
        }
    }
}
