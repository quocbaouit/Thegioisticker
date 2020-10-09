using Thegioisticker.API.Models;
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
    /// Get all Products
    /// </summary>
    [RoutePrefix("api/company")]
    public class CompanyController : ApiController
    {
        private readonly IProductService productService;

        public CompanyController(IProductService productService)
        {
            this.productService = productService;
        }
        [HttpGet]
        [Route("getPagingProducts")]
        public DataTableResponse GetProducts(DataTableRequest request)
        {
            // Query products
            var products = productService.GetProducts();

            // Searching Data
            IEnumerable<Product> filteredProducts;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredProducts = products.Where(p => p.Name.Contains(searchText));
            }
            else
            {
                filteredProducts = products;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Product, string> orderingFunctionString = null;
                Func<Product, int> orderingFunctionInt = null;
                Func<Product, decimal?> orderingFunctionDecimal = null;

                switch (sortColumnIndex)
                {
                    case 0:     // ProductID
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredProducts =
                                sortDirection == "asc"
                                    ? filteredProducts.OrderBy(orderingFunctionInt)
                                    : filteredProducts.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:     // ProductName
                        {
                            orderingFunctionString = (c => c.Name);
                            filteredProducts =
                                sortDirection == "asc"
                                    ? filteredProducts.OrderBy(orderingFunctionString)
                                    : filteredProducts.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:     // UnitPrice
                        {
                            orderingFunctionDecimal = (c => c.Price);
                            filteredProducts =
                                sortDirection == "asc"
                                    ? filteredProducts.OrderBy(orderingFunctionDecimal)
                                    : filteredProducts.OrderByDescending(orderingFunctionDecimal);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedProducts = filteredProducts.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = products.Count(),
                recordsFiltered = products.Count(),
                data = pagedProducts.ToArray(),
                error = ""
            };
        }

        [Route("GetProductById/{id}")]
        public IHttpActionResult GetProductById(int Id)
        {
            var product = productService.GetProduct(Id);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();

        }
        [Route("CreateProduct")]
        public IHttpActionResult CreateProduct(Product productModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                productService.UpdateProduct(productModel);
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}