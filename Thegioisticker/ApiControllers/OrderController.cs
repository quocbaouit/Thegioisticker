using Thegioisticker.API.Models;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using Thegioisticker.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Thegioisticker.API.Controllers
{
    /// <summary>
    /// Get all Products
    /// </summary>
    [RoutePrefix("api/order")]
    public class OrderController : ApiController
    {
        private readonly IProductService productService;
        private readonly IOrderService orderService;
        private AuthRepository _repo = null;
        public OrderController(IProductService productService, IOrderService orderService)
        {
            this.productService = productService;
            this.orderService = orderService;
            _repo = new AuthRepository();
        }
        [Route("adminSaveOrder")]
        public IHttpActionResult CreateOrder(Order order)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (order.DeliveryDate != null)
                {
                    var date = order.DeliveryDate ?? new DateTime();
                    order.DeliveryDate = date.ToLocalTime();
                }            
                 orderService.UpdateOrder(order);
                return Ok();

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("CreateOrder")]
        public IHttpActionResult CreateOrder(OrderModel orderModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var result = orderService.CreateOrder(orderModel);
                
                return Ok(result);

            }
            catch (Exception)
            {
                return BadRequest();
            }
        }


        [HttpGet]
        [Route("getPagingOrders")]
        public DataTableResponse GetOrders(DataTableRequest request)
        {
            // Query orders
            var orders = orderService.GetOrders();

            // Searching Data
            IEnumerable<Order> filteredorders;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredorders = orders.Where(p => p.CustomerName.Contains(searchText));
            }
            else
            {
                filteredorders = orders;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Order, string> orderingFunctionString = null;
                Func<Order, int> orderingFunctionInt = null;

                switch (sortColumnIndex)
                {
                    case 0:
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredorders =
                                sortDirection == "desc"
                                    ? filteredorders.OrderBy(orderingFunctionInt)
                                    : filteredorders.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:
                        {
                            orderingFunctionString = (c => c.CustomerName);
                            filteredorders =
                                sortDirection == "asc"
                                    ? filteredorders.OrderBy(orderingFunctionString)
                                    : filteredorders.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:
                        {
                            orderingFunctionString = (c => c.Note);
                            filteredorders =
                                sortDirection == "asc"
                                    ? filteredorders.OrderBy(orderingFunctionString)
                                    : filteredorders.OrderByDescending(orderingFunctionString);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedorders = filteredorders.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = orders.Count(),
                recordsFiltered = orders.Count(),
                data = pagedorders.ToArray(),
                error = ""
            };
        }

        [Route("GetOrderById/{id}")]
        public IHttpActionResult GetOrderById(int Id)
        {
            var order = orderService.GetOrder(Id);
            if (order != null)
            {
                return Ok(order);
            }
            return NotFound();

        }
        
        [HttpPost]
        [Route("deleteOrder")]
        public IHttpActionResult DeleteOrder(Order orderModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (orderModel.Id != 0)
                {
                    orderModel.IsDelete = true;
                    orderService.UpdateOrder(orderModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
        [HttpPost]
        [Route("deleteOrderDetail")]
        public IHttpActionResult DeleteOrderDetail(OrderDetail orderDetail)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (orderDetail.Id != 0)
                {
                    orderService.DeleteOrderDetail(orderDetail);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}