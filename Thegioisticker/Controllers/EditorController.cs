﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Thegioisticker.Web.Controllers
{
    [AllowSameSite]
    public class EditorController : Controller
    {
        // GET: Product
        public ActionResult Index()
        {
            return View();
        }
    }
}