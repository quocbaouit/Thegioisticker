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
    [RoutePrefix("api/blog")]
    public class BlogController : ApiController
    {
        private readonly IBlogService blogService;

        public BlogController(IBlogService blogService)
        {
            this.blogService = blogService;
        }
        //[HttpGet]
        //[Route("getBlogs")]
        //public IHttpActionResult GetBlogs(int pageIndex, int pageSize)
        //{
        //    var blogs = blogService.GetPagingBlog(pageIndex, pageSize);
        //    if (blogs != null)
        //        return Ok(blogs);
        //    return NotFound();
        //}
        [HttpGet]
        [Route("getBlogs")]
        public IHttpActionResult GetBlogs(int pageIndex, int pageSize)
        {
            var blogs = blogService.GetPagingBlog(pageIndex,pageSize);
            if (blogs != null)
                return Ok(blogs);
            return NotFound();
        }
        
       [HttpGet]
        [Route("getPagingBlogs")]
        public DataTableResponse GetBlogs(DataTableRequest request)
        {
            // Query blogs
            var blogs = blogService.GetBlogs();

            // Searching Data
            IEnumerable<Blog> filteredblogs;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredblogs = blogs.Where(p => p.Author.Contains(searchText));
            }
            else
            {
                filteredblogs = blogs;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Blog, string> orderingFunctionString = null;
                Func<Blog, int> orderingFunctionInt = null;
                Func<Blog, bool> orderingFunctionBool = null;

                switch (sortColumnIndex)
                {
                    case 0:
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredblogs =
                                sortDirection == "asc"
                                    ? filteredblogs.OrderByDescending(orderingFunctionInt)
                                    : filteredblogs.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:
                        {
                            orderingFunctionString = (c => c.Title);
                            filteredblogs =
                                sortDirection == "asc"
                                    ? filteredblogs.OrderBy(orderingFunctionString)
                                    : filteredblogs.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:
                        {
                            orderingFunctionString = (c => c.Author);
                            filteredblogs =
                                sortDirection == "asc"
                                    ? filteredblogs.OrderBy(orderingFunctionString)
                                    : filteredblogs.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 5:
                        {
                            orderingFunctionBool = (c => c.isInHomePage);
                            filteredblogs =
                                sortDirection == "asc"
                                    ? filteredblogs.OrderBy(orderingFunctionBool)
                                    : filteredblogs.OrderByDescending(orderingFunctionBool);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedblogs = filteredblogs.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = blogs.Count(),
                recordsFiltered = blogs.Count(),
                data = pagedblogs.ToArray(),
                error = ""
            };
        }
        [HttpGet]
        [Route("getPagingBlogsForHomePage")]
        public DataTableResponse GetPagingBlogsForHomePage(DataTableRequest request)
        {
            // Query blogs
            var blogs = blogService.GetBlogs().Where(x=>x.isInHomePage);

            // Searching Data
            IEnumerable<Blog> filteredblogs;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredblogs = blogs.Where(p => p.Author.Contains(searchText));
            }
            else
            {
                filteredblogs = blogs;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Blog, string> orderingFunctionString = null;
                Func<Blog, int> orderingFunctionInt = null;
                Func<Blog, bool> orderingFunctionBool = null;

                switch (sortColumnIndex)
                {
                    case 0:
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredblogs =
                                sortDirection == "asc"
                                    ? filteredblogs.OrderBy(orderingFunctionInt)
                                    : filteredblogs.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:
                        {
                            orderingFunctionString = (c => c.Title);
                            filteredblogs =
                                sortDirection == "asc"
                                    ? filteredblogs.OrderBy(orderingFunctionString)
                                    : filteredblogs.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:
                        {
                            orderingFunctionString = (c => c.Author);
                            filteredblogs =
                                sortDirection == "asc"
                                    ? filteredblogs.OrderBy(orderingFunctionString)
                                    : filteredblogs.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 5:
                        {
                            orderingFunctionBool = (c => c.isInHomePage);
                            filteredblogs =
                                sortDirection == "asc"
                                    ? filteredblogs.OrderBy(orderingFunctionBool)
                                    : filteredblogs.OrderByDescending(orderingFunctionBool);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedblogs = filteredblogs.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = blogs.Count(),
                recordsFiltered = blogs.Count(),
                data = pagedblogs.ToArray(),
                error = ""
            };
        }
        [Route("getBlogForHomePage")]
        public IHttpActionResult GetBlogForHomePage()
        {
            var blog = blogService.GetBlogForHomePage();
            if (blog != null)
            {
                return Ok(blog);
            }
            return NotFound();

        }
        [Route("GetBlogById/{id}")]
        public IHttpActionResult GetBlogById(int Id)
        {
            var blog = blogService.GetBlog(Id);
            if (blog != null)
            {
                return Ok(blog);
            }
            return NotFound();

        }
        [Route("GetBlogBySeoUrl/{seoUrl}")]
        public IHttpActionResult GetBlogBySeoUrl(string seoUrl)
        {
            var blog = blogService.GetBlogBySeoUrl(seoUrl);
            if (blog != null)
            {
                return Ok(blog);
            }
            return NotFound();

        }

        [HttpPost]
        [Route("deleteBlog")]
        public IHttpActionResult DeleteBlog(Blog blogModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (blogModel.Id != 0)
                {
                    blogModel.isDelete = true;
                    blogService.UpdateBlog(blogModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("saveBlog")]
        public IHttpActionResult saveBlog(Blog blogModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (blogModel.Id != 0)
                {
                    blogService.UpdateBlog(blogModel);
                }
                else
                {
                    blogService.CreateBlog(blogModel);
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