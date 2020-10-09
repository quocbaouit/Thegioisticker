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
    [RoutePrefix("api/products")]
    public class ProductController : ApiController
    {
        private readonly IProductService productService;

        public ProductController(IProductService productService)
        {
            this.productService = productService;
        }
        [HttpGet]
        [Route("GetProductsForSale")]
        public IHttpActionResult GetProductsForSale(int pageIndex, int pageSize,int categoryId)
        {
            var products = productService.GetPagingProduct(pageIndex, pageSize, categoryId);
            if (products != null)
                return Ok(products);
            return NotFound();
        }
        [HttpGet]
        [Route("getProductsByCategory/{category}")]
        public IHttpActionResult GetProductsByCategory(int category)
        {
            var  products = productService.GetProducts().Where(x=>x.ProductCategoryId== category);
            if (products != null)
                return Ok(products);
            return NotFound();
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
                Func<Product, bool?> orderingFunctionBool = null;

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
                         case 5:     // ProductName
                        {
                            orderingFunctionBool = (c => c.regularProducts);
                            filteredProducts =
                                sortDirection == "asc"
                                    ? filteredProducts.OrderBy(orderingFunctionBool)
                                    : filteredProducts.OrderByDescending(orderingFunctionBool);
                            break;
                        }
                    case 6:     // UnitPrice
                        {
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
        [HttpGet]
        [Route("getPagingProductsRegular")]
        public DataTableResponse GetProductsRegular(DataTableRequest request)
        {
            // Query products
            var products = productService.GetProducts().Where(x=>x.regularProducts);

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
                Func<Product, bool?> orderingFunctionBool = null;

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
                    case 5:     // ProductName
                        {
                            orderingFunctionBool = (c => c.regularProducts);
                            filteredProducts =
                                sortDirection == "asc"
                                    ? filteredProducts.OrderBy(orderingFunctionBool)
                                    : filteredProducts.OrderByDescending(orderingFunctionBool);
                            break;
                        }
                    case 6:     // UnitPrice
                        {
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
        [Route("getProductsRegular")]
        public IHttpActionResult GetProductsRegular()
        {
            var product = productService.GetProducts().OrderBy(x => x.Name);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();

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
        [Route("GetProductByCode/{code}")]
        public IHttpActionResult GetProductByCode(string code)
        {
            var product = productService.GetProduct(code);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();

        }
        [Route("getSampleByProductById/{id}")]
        public IHttpActionResult GetSampleByProductById(int Id)
        {
            var product = productService.GetSampleByProductById(Id);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();

        }

        [Route("getProductCategory")]
        public IHttpActionResult GetProductCategory()
        {
            var productCategory = productService.GetProductCategory();
            if (productCategory != null)
            {
                return Ok(productCategory);
            }
            return NotFound();

        }

        [HttpPost]
        [Route("CreateProduct")]
        public IHttpActionResult CreateProduct(Product productModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (productModel.Id != 0) {
                    productService.UpdateProduct(productModel);
                }
                else {
                    productService.CreateProduct(productModel);
                }
              
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
        [HttpPost]
        [Route("updateProductDescription")]
        public IHttpActionResult UpdateProductDescription(Product productModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (productModel.Id != 0)
                {
                    productService.UpdateProductDescription(productModel.Id, productModel.Description);
                }
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("getProductSamplesByProductId/{productId}")]
        public IHttpActionResult getProductSamplesByProductId(int productId)
        {
            var result = productService.GetProductSampleByProductId(productId);
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound();

        }
        [HttpPost]
        [Route("createProductSample")]
        public IHttpActionResult CreateProductSample(List<ProductSample> productModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                    productService.CreateProductSample(productModel);
              
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [Route("getProductBySeoUrl/{seoUrl}")]
        public IHttpActionResult GetBlogBySeoUrl(string seoUrl)
        {
            var blog = productService.GetProductBySeoUrl(seoUrl);
            if (blog != null)
            {
                return Ok(blog);
            }
            return NotFound();

        }
        [Route("getSampleByProductBySeoUrl/{seoUrl}")]
        public IHttpActionResult GetSampleByProductBySeoUrl(string seoUrl)
        {
            var product = productService.GetSampleByProductBySeoUrl(seoUrl);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();

        }
    }
}