using Thegioisticker.API.Models;
using Thegioisticker.API.ViewModels;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using Thegioisticker.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Thegioisticker.API.Controllers
{
    /// <summary>
    /// Get all customer
    /// </summary>
    [RoutePrefix("api/customer")]
    public class CustomerController : ApiController
    {
        private readonly ICustomerService customerService; 
            private readonly IOrderService orderService;

        public CustomerController(ICustomerService customerService, IOrderService orderService)
        {
            this.customerService = customerService;
            this.orderService = orderService;
        }
        [Route("getCustomerByUserId")]
        public IHttpActionResult GetFaqById(string userId)
        {
            var customer = customerService.GetCustomerByUserId(userId);
                return Ok(customer);
        }
        [HttpGet]
        [Route("getCustomers")]
        public IHttpActionResult GetCustomers()
        {
            var customers = customerService.GetCustomers();
            if (customers != null)
                return Ok(customers);
            return NotFound();
        }
        [HttpGet]
        [Route("getPagingCustomers")]
        public DataTableResponse GetCustomers(DataTableRequest request)
        {
            // Query customers
            var customers = customerService.GetCustomers();

            // Searching Data
            IEnumerable<Customer> filteredcustomers;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredcustomers = customers.Where(p => p.FullName.Contains(searchText));
            }
            else
            {
                filteredcustomers = customers;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Customer, string> orderingFunctionString = null;
                Func<Customer, int> orderingFunctionInt = null;

                switch (sortColumnIndex)
                {
                    case 0:     // customerID
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredcustomers =
                                sortDirection == "asc"
                                    ? filteredcustomers.OrderByDescending(orderingFunctionInt)
                                    : filteredcustomers.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:     // customerName
                        {
                            orderingFunctionString = (c => c.FullName);
                            filteredcustomers =
                                sortDirection == "asc"
                                    ? filteredcustomers.OrderBy(orderingFunctionString)
                                    : filteredcustomers.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:     // Answer
                        {
                            orderingFunctionString = (c => c.Address);
                            filteredcustomers =
                                sortDirection == "asc"
                                    ? filteredcustomers.OrderBy(orderingFunctionString)
                                    : filteredcustomers.OrderByDescending(orderingFunctionString);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedcustomers = filteredcustomers.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = customers.Count(),
                recordsFiltered = customers.Count(),
                data = pagedcustomers.ToArray(),
                error = ""
            };
        }

        [Route("GetCustomerById/{id}")]
        public IHttpActionResult GetCustomerById(int Id)
        {
            var customer = customerService.GetCustomer(Id);
            if (customer != null)
            {
                return Ok(customer);
            }
            return NotFound();

        }
        [HttpGet]
        [Route("getPagingOrders")]
        public DataTableResponse GetOrders(DataTableRequest request, int customerId)
        {
            // Query orders
            var orders = orderService.GetOrders().Where(x => x.CustomerId == customerId);

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


        [Route("saveCustomer")]
        public IHttpActionResult saveCustomer(Customer customerModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (customerModel.Id != 0)
                {
                    customerService.UpdateCustomer(customerModel);
                }
                else
                {
                    customerService.CreateCustomer(customerModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("deleteCustomer")]
        public IHttpActionResult DeleteCustomer(DeleteCustomerModel customerModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                customerService.DeleteCustomer(customerModel.UserId);

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}