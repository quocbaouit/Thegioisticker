using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Thegioisticker.Web.Controllers
{
    [AllowSameSite]
    public class CompanyController : Controller
    {
        [OutputCache(Duration = 86400, VaryByParam = "none")]
        public ActionResult Index()
        {
            return View();
        }
        [OutputCache(Duration = 86400, VaryByParam = "none")]
        public ActionResult Contact()
        {
            return View();
        }
        [OutputCache(Duration = 86400, VaryByParam = "none")]
        public ActionResult Recruitment()
        {
            return View();
        }
        [OutputCache(Duration = 86400, VaryByParam = "none")]
        public ActionResult Rule()
        {
            return View();
        }
        [OutputCache(Duration = 86400, VaryByParam = "none")]
        public ActionResult Delivery()
        {
            return View();
        }
        [OutputCache(Duration = 86400, VaryByParam = "none")]
        public ActionResult PrivacyPolicy()
        {
            return View();
        }
    }
}