using Newtonsoft.Json;
using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface IOrderService
    {
        int CreateOrder(OrderModel Product);
        void UpdateOrder(Order order);
        Order GetOrder(int id);
        IEnumerable<Order> GetOrders();
        void UpdateOrderDetail(OrderDetail detail);
        void DeleteOrderDetail(OrderDetail orderDetail);
        void SaveOrder();
    }

    public class OrderService : IOrderService
    {
        private readonly ICouponRepository _CouponRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IOrderDetailRepository _orderDetailRepository;
        private readonly ICustomerService _customerService;
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(ICouponRepository CouponRepository, IOrderRepository orderRepository, IOrderDetailRepository orderDetailRepository, ICustomerService customerService, IUnitOfWork unitOfWork)
        {
            this._CouponRepository = CouponRepository;
            this._customerService = customerService;
            this._orderRepository = orderRepository;
            this._orderDetailRepository = orderDetailRepository;
            this._unitOfWork = unitOfWork;
        }

        #region IOrderService Members
        private void CreateOrderDetail(OrderDetail detail)
        {
            _orderDetailRepository.Add(detail);
            _unitOfWork.Commit();
        }

        private void UpdateCoupon(string couponCode)
        {
            var counpon = _CouponRepository.Get(x => x.Code == couponCode);
            if (counpon !=null) {
                counpon.Used++;
            }
            _CouponRepository.Update(counpon);
            _unitOfWork.Commit();
        }
        public void UpdateOrderDetail(OrderDetail detail)
        {
            _orderDetailRepository.Update(detail);
            _unitOfWork.Commit();
        }
        private void CreateOrder(Order order)
        {
            _orderRepository.Add(order);
            _unitOfWork.Commit();
        }
        public int CreateOrder(OrderModel orderModel)
        {
            Customer customer = new Customer();
            if (orderModel.Customer.Id != 0)
            {
                customer = _customerService.GetCustomerById(orderModel.Customer.Id);
                customer.FullName = orderModel.Customer.FullName;
                customer.Email = orderModel.Customer.Email;
                customer.Address = orderModel.Customer.Address;
                customer.PhoneNumber = orderModel.Customer.PhoneNumber;
                _customerService.UpdateCustomer(customer);
            }
            else
            {

                customer.UserId = orderModel.Customer.UserId;
                customer.FullName = orderModel.Customer.FullName;
                customer.Address = orderModel.Customer.Address;
                customer.Email = orderModel.Customer.Email;
                customer.PhoneNumber = orderModel.Customer.PhoneNumber;
                _customerService.CreateCustomer(customer);
            }
            if (orderModel.DiscountValue == 0)
            {
                orderModel.CouponName = "";
            }
            var order = new Order()
            {
                CustomerId = customer.Id,
                CustomerName = customer.FullName,
                Total = orderModel.Total,
                PayMentMethol=orderModel.PayMentMethol,
                OrderStatus=0,
                Note=orderModel.Note,
                CouponName= orderModel.CouponName,
                DiscountValue= orderModel.DiscountValue,
                CouponType=orderModel.CouponType
            };
            CreateOrder(order);
            foreach (var product in orderModel.Products)
            {
                var orderDetail = new OrderDetail();               
                orderDetail.OrderId = order.Id;
                orderDetail.ProductId = product.Id;
                orderDetail.ProductName = product.Name;
                orderDetail.Price = product.Price;
                orderDetail.Quantity = product.Quantity;
                orderDetail.SubTotal = product.SubTotal;   
                orderDetail.Width = product.Width;
                orderDetail.Machining = product.Machining;
                orderDetail.Height = product.Height;
                orderDetail.Cut = product.Cut;
                orderDetail.CutType = product.CutType;
                orderDetail.FileDescription = product.FileDescription;
                orderDetail.TransactionId = product.TransactionId;

                orderDetail.Note = product.Machining;
                orderDetail.DeliveryDate = product.DeliveryDate;
                orderDetail.CouponName = product.CouponName;
                orderDetail.CouponType = product.CouponType;
                orderDetail.CouponValue = product.CouponValue;
                orderDetail.DiscountValue = product.DiscountValue;

                orderDetail.FileType = product.FileType;
                orderDetail.FileId = product.FileId;
                orderDetail.SettingModal = product.SettingModal;
                orderDetail.Image = product.Image;
                CreateOrderDetail(orderDetail);
            }
            if (!string.IsNullOrEmpty(orderModel.CouponName) && orderModel.DiscountValue>0)
            {
                UpdateCoupon(orderModel.CouponName);
            }
            return order.Id;
           
        }
        public IEnumerable<Order> GetOrders()
        {
            var orders = _orderRepository.GetMany(x => !x.IsDelete);
            return orders;
        }
        public Order GetOrder(int id)
        {
            var order = _orderRepository.GetById(id);
            return order;
        }
        public void UpdateOrder(Order order)
        {
            var newDetail = order.OrderDetail;
           
            var oldDetails = _orderDetailRepository.GetMany(x => x.OrderId == order.Id);
            foreach (var old in oldDetails)
            {
                _orderDetailRepository.Delete(old);
                _unitOfWork.Commit();
            }
            foreach (var detail in newDetail)
            {
                CreateOrderDetail(detail);
            }
            _orderRepository.Update(order);
            order.Total = newDetail.Sum(x => x.Price * x.Quantity);
            SaveOrder();
        }
        public void DeleteOrderDetail(OrderDetail orderDetail)
        {
            _orderDetailRepository.Delete(orderDetail);
            _unitOfWork.Commit();
        }
        public void SaveOrder()
        {
            _unitOfWork.Commit();
        }

        #endregion
    
    }
}
