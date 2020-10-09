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
    [RoutePrefix("api/contentPage")]
    public class ContentPageController : ApiController
    {
        private readonly IContentPageService contentPageService;

        public ContentPageController(IContentPageService contentPageService)
        {
            this.contentPageService = contentPageService;
        }
        //[HttpGet]
        //[Route("getContentPages")]
        //public IHttpActionResult GetContentPages(int pageIndex, int pageSize)
        //{
        //    var contentPages = contentPageService.GetPagingContentPage(pageIndex, pageSize);
        //    if (contentPages != null)
        //        return Ok(contentPages);
        //    return NotFound();
        //}
        [HttpGet]
        [Route("getContentPages")]
        public IHttpActionResult GetContentPages()
        {
            var contentPages = contentPageService.GetContentPages();
            if (contentPages != null)
                return Ok(contentPages);
            return NotFound();
        }
        
       [HttpGet]
        [Route("getPagingContentPages")]
        public DataTableResponse GetContentPages(DataTableRequest request)
        {
            // Query contentPages
            var contentPages = contentPageService.GetContentPages();

            // Searching Data
            IEnumerable<ContentPage> filteredcontentPages;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredcontentPages = contentPages.Where(p => p.Description.Contains(searchText));
            }
            else
            {
                filteredcontentPages = contentPages;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<ContentPage, string> orderingFunctionString = null;
                Func<ContentPage, int> orderingFunctionInt = null;
                Func<ContentPage, bool> orderingFunctionBool = null;

                switch (sortColumnIndex)
                {
                    case 0:
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredcontentPages =
                                sortDirection == "asc"
                                    ? filteredcontentPages.OrderBy(orderingFunctionInt)
                                    : filteredcontentPages.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:
                        {
                            orderingFunctionString = (c => c.Title);
                            filteredcontentPages =
                                sortDirection == "asc"
                                    ? filteredcontentPages.OrderBy(orderingFunctionString)
                                    : filteredcontentPages.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:
                        {
                            orderingFunctionString = (c => c.Description);
                            filteredcontentPages =
                                sortDirection == "asc"
                                    ? filteredcontentPages.OrderBy(orderingFunctionString)
                                    : filteredcontentPages.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 5:
                        {
                            orderingFunctionBool = (c => c.isDelete);
                            filteredcontentPages =
                                sortDirection == "asc"
                                    ? filteredcontentPages.OrderBy(orderingFunctionBool)
                                    : filteredcontentPages.OrderByDescending(orderingFunctionBool);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedcontentPages = filteredcontentPages.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = contentPages.Count(),
                recordsFiltered = contentPages.Count(),
                data = pagedcontentPages.ToArray(),
                error = ""
            };
        }
        [HttpGet]
        [Route("getPagingContentPagesForHomePage")]
        public DataTableResponse GetPagingContentPagesForHomePage(DataTableRequest request)
        {
            // Query contentPages
            var contentPages = contentPageService.GetContentPages().Where(x=>x.isDelete);

            // Searching Data
            IEnumerable<ContentPage> filteredcontentPages;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredcontentPages = contentPages.Where(p => p.Description.Contains(searchText));
            }
            else
            {
                filteredcontentPages = contentPages;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<ContentPage, string> orderingFunctionString = null;
                Func<ContentPage, int> orderingFunctionInt = null;
                Func<ContentPage, bool> orderingFunctionBool = null;

                switch (sortColumnIndex)
                {
                    case 0:
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredcontentPages =
                                sortDirection == "asc"
                                    ? filteredcontentPages.OrderBy(orderingFunctionInt)
                                    : filteredcontentPages.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:
                        {
                            orderingFunctionString = (c => c.Title);
                            filteredcontentPages =
                                sortDirection == "asc"
                                    ? filteredcontentPages.OrderBy(orderingFunctionString)
                                    : filteredcontentPages.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:
                        {
                            orderingFunctionString = (c => c.Description);
                            filteredcontentPages =
                                sortDirection == "asc"
                                    ? filteredcontentPages.OrderBy(orderingFunctionString)
                                    : filteredcontentPages.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 5:
                        {
                            orderingFunctionBool = (c => c.isDelete);
                            filteredcontentPages =
                                sortDirection == "asc"
                                    ? filteredcontentPages.OrderBy(orderingFunctionBool)
                                    : filteredcontentPages.OrderByDescending(orderingFunctionBool);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedcontentPages = filteredcontentPages.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = contentPages.Count(),
                recordsFiltered = contentPages.Count(),
                data = pagedcontentPages.ToArray(),
                error = ""
            };
        }
        [Route("getContentPageForHomePage")]
        public IHttpActionResult GetContentPageForHomePage()
        {
            var contentPage = contentPageService.GetContentPages().Where(x => x.isDelete);
            if (contentPage != null)
            {
                return Ok(contentPage);
            }
            return NotFound();

        }
        [Route("GetContentPageById/{id}")]
        public IHttpActionResult GetContentPageById(int Id)
        {
            var contentPage = contentPageService.GetContentPage(Id);
            if (contentPage != null)
            {
                return Ok(contentPage);
            }
            return NotFound();

        }

        [HttpPost]
        [Route("deleteContentPage")]
        public IHttpActionResult DeleteContentPage(ContentPage contentPageModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (contentPageModel.Id != 0)
                {
                    contentPageModel.isDelete = true;
                    contentPageService.UpdateContentPage(contentPageModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("saveContentPage")]
        public IHttpActionResult saveContentPage(ContentPage contentPageModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (contentPageModel.Id != 0)
                {
                    contentPageService.UpdateContentPage(contentPageModel);
                }
                else
                {
                    contentPageService.CreateContentPage(contentPageModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("getAllContentPage")]
        public IHttpActionResult GetAllContentPages()
        {
            var sample = contentPageService.GetContentPages();
            if (sample != null)
            {
                return Ok(sample);
            }
            return NotFound();

        }
    }
}