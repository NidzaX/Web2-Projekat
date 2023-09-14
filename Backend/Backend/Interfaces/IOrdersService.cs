using Backend.Dto;
using Backend.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Interfaces
{
    public interface IOrdersService
    {
        int AddOrder(NewOrderProductDto dto);
        List<GetAllOrdersDto> GetAllOrders();
        List<GetAllOrdersBuyerDto> GetAllOrdersBuyer(string buyer);
        bool CancelOrder(long orderId);
        List<GetOrderDetailsProductDto> GetOrderDetailsAdmin(long orderId);
        List<GetAllOrdersDto> GetAllOrdersSeller(string seller);
        List<GetOrderDetailsProductDtoSeller> GetOrderDetailsSeller(long orderId, string username);
        //List<GetOrderDetailsProductDto> GetOrderDetailsBuyer(long orderId);
    }
}
