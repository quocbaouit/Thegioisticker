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
        private readonly ICategoryService categoryService;

        public HomeController(ICategoryService categoryService)
        {
            this.categoryService = categoryService;
        }

        //[OutputCache(Duration = 3600, VaryByParam = "none")]
        // GET: Home
        public ActionResult Index(string category = null)
        {
            IEnumerable<CategoryViewModel> viewModelGadgets;
            IEnumerable<Category> categories;

            categories = categoryService.GetCategories(category).ToList();

            viewModelGadgets = Mapper.Map<IEnumerable<Category>, IEnumerable<CategoryViewModel>>(categories);
            return View(viewModelGadgets);
        }

        public ActionResult Filter(string category, string gadgetName)
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

            var category = categoryService.GetCategory(newGadget.GadgetCategory);
            return RedirectToAction("Index", new { category = category.Name });
        }
    }
}