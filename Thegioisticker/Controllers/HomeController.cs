using AutoMapper;
using Thegioisticker.API.ViewModels;
using Thegioisticker.Model;
using Thegioisticker.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Thegioisticker.Controllers
{
    [AllowSameSite]
    public class HomeController : Controller
    {
        private readonly IPageService PageService;

        public HomeController(IPageService PageService)
        {
            this.PageService = PageService;
        }

        //[OutputCache(Duration = 3600, VaryByParam = "none")]
        // GET: Home
        public ActionResult Index(string Page = null)
        {
            IEnumerable<CategoryViewModel> viewModelGadgets;
            IEnumerable<Page> categories;

            categories = PageService.GetCategories(Page).ToList();

            viewModelGadgets = Mapper.Map<IEnumerable<Page>, IEnumerable<CategoryViewModel>>(categories);
            return View(viewModelGadgets);
        }

        public ActionResult Filter(string Page, string gadgetName)
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(GadgetFormViewModel newGadget)
        {
            if (newGadget != null && newGadget.File != null)
            {

                string gadgetPicture = System.IO.Path.GetFileName(newGadget.File.FileName);
                string path = System.IO.Path.Combine(Server.MapPath("~/images/"), gadgetPicture);
                newGadget.File.SaveAs(path);
            }

            var Page = PageService.GetPage(newGadget.GadgetCategory);
            return RedirectToAction("Index", new { Page = Page.Name });
        }
    }
}