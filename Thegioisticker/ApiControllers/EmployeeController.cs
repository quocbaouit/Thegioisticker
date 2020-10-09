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
    /// Get all employee
    /// </summary>
    [RoutePrefix("api/employee")]
    public class EmployeeController : ApiController
    {
        private readonly IEmployeeService employeeService; 
            private readonly IOrderService orderService;

        public EmployeeController(IEmployeeService employeeService, IOrderService orderService)
        {
            this.employeeService = employeeService;
            this.orderService = orderService;
        }
        [Route("getEmployeeByUserId")]
        public IHttpActionResult GetFaqById(string userId)
        {
            var employee = employeeService.GetEmployeeByUserId(userId);
                return Ok(employee);
        }
        [HttpGet]
        [Route("getEmployees")]
        public IHttpActionResult GetEmployees()
        {
            var employees = employeeService.GetEmployees();
            if (employees != null)
                return Ok(employees);
            return NotFound();
        }
        [HttpGet]
        [Route("getPagingEmployees")]
        public DataTableResponse GetEmployees(DataTableRequest request)
        {
            // Query employees
            var employees = employeeService.GetEmployees();

            // Searching Data
            IEnumerable<ApplicationUser> filteredemployees;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredemployees = employees.Where(p => p.FullName.Contains(searchText));
            }
            else
            {
                filteredemployees = employees;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<ApplicationUser, string> orderingFunctionString = null;
                Func<ApplicationUser, int> orderingFunctionInt = null;

                switch (sortColumnIndex)
                {
                    case 0:     // employeeID
                        {
                            orderingFunctionInt = (c => 1);
                            filteredemployees =
                                sortDirection == "asc"
                                    ? filteredemployees.OrderByDescending(orderingFunctionInt)
                                    : filteredemployees.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:     // employeeName
                        {
                            orderingFunctionString = (c => c.FullName);
                            filteredemployees =
                                sortDirection == "asc"
                                    ? filteredemployees.OrderBy(orderingFunctionString)
                                    : filteredemployees.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:     // Answer
                        {
                            orderingFunctionString = (c => c.Address);
                            filteredemployees =
                                sortDirection == "asc"
                                    ? filteredemployees.OrderBy(orderingFunctionString)
                                    : filteredemployees.OrderByDescending(orderingFunctionString);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedemployees = filteredemployees.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = employees.Count(),
                recordsFiltered = employees.Count(),
                data = pagedemployees.ToArray(),
                error = ""
            };
        }

        [Route("GetEmployeeById/{id}")]
        public IHttpActionResult GetEmployeeById(int Id)
        {
            var employee = employeeService.GetEmployee(Id);
            if (employee != null)
            {
                return Ok(employee);
            }
            return NotFound();

        }



        [Route("saveEmployee")]
        public IHttpActionResult saveEmployee(ApplicationUser employeeModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (employeeModel.Id != "0")
                {
                    employeeService.UpdateEmployee(employeeModel);
                }
                else
                {
                    employeeService.CreateEmployee(employeeModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
        [Route("updateEmployee")]
        public IHttpActionResult updateEmployee(ApplicationUser employeeModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (employeeModel.Id != "0")
                {
                    employeeService.UpdateEmployee(employeeModel);
                }
                else
                {
                    employeeService.CreateEmployee(employeeModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("deleteEmployee")]
        public IHttpActionResult DeleteCustomer(DeleteEmployeeModel employeeModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                employeeService.DeleteEmployee(employeeModel.UserId);

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}