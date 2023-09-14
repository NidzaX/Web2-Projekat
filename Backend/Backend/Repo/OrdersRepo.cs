using Backend.Infrastracture;
using Backend.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repo
{
    public class OrdersRepo
    {
        private ProjectDbContext projectDbContext;

        public OrdersRepo(ProjectDbContext context)
        {
            projectDbContext = context;
        }
        public Order AddOrder(Order o)
        {
            Order retVal = projectDbContext.Orders.Add(o).Entity;
            projectDbContext.SaveChanges();
            return retVal;
        }
        public Order FindOrder(long id)
        {
            return projectDbContext.Orders.Find(id);
        }
        public Order UpdateOrder(Order o)
        {
            Order retVal = projectDbContext.Orders.Update(o).Entity;
            projectDbContext.SaveChanges();
            return retVal;
        }
        public List<Order> GetAll()
        {
            return projectDbContext.Orders.ToList();
        }
    }
}
