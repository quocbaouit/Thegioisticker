using Thegioisticker.Service;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Thegioisticker.Web.Controllers
{
    [AllowSameSite]
    public class ProductController : Controller
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            this._productService = productService;
        }
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ProductFullWith()
        {
            return View();
        }
        public ActionResult ProductDetail(string seoUrl)
        {
            var product = _productService.GetProductBySeoUrl(seoUrl);
            ViewBag.description = product.Description;
            ViewBag.MetaTitle = product.MetaTitle;
            ViewBag.MetaDescription = product.MetaDescription;
            return View();
        }
        public ActionResult ProductGallery()
        {
            return View();
        }
    }
}