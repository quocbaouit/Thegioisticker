using Thegioisticker.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Thegioisticker.Web.Controllers
{
    [AllowSameSite]
    public class BlogController : Controller
    {
        private readonly IBlogService blogService;
        public BlogController(IBlogService blogService)
        {
            this.blogService = blogService;
        }
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult BlogDetail(string seoUrl)
        {
            var blog = blogService.GetBlogBySeoUrl(seoUrl);
            ViewBag.Content = blog.Content;
            ViewBag.MetaTitle = blog.MetaTitle;
            ViewBag.MetaDescription = blog.MetaDescription;
            return View();
        }
    }
}