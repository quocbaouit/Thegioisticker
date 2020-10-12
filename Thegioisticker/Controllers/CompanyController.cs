using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Thegioisticker.Service;

namespace Thegioisticker.Web.Controllers
{
    [AllowSameSite]
    public class CompanyController : Controller
    {
        private readonly IContentPageService _contentPageService;

        public CompanyController(IContentPageService contentPageService)
        {
            this._contentPageService = contentPageService;
        }
        //[OutputCache(Duration = 86400, VaryByParam = "none")]
        public ActionResult Index(string seoUrl)
        {
            var contentPage = _contentPageService.GetContentPageBySeoUrl(seoUrl);
            ViewBag.content = contentPage.Content;
            ViewBag.MetaTitle = contentPage.MetaTitle;
            ViewBag.MetaDescription = contentPage.MetaDescription;
            return View();
        }
        //[OutputCache(Duration = 86400, VaryByParam = "none")]
        public ActionResult Contact()
        {
            return View();
        }
    }
}