using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Thegioisticker.Web.Controllers
{
    [AllowSameSite]
    public class UserController : Controller
    {
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public ActionResult ResetPassword(string token, string email)
        {
            var model = new ResetPasswordModel { Token = token, Email = email };
            return View(model);
        }
    }

    public class ResetPasswordModel
    {
        public string Token { get; set; }
        public string Email { get; set; }
    }
}