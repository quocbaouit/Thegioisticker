using Thegioisticker.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Thegioisticker.Web.Controllers
{
    [AllowSameSite]
    public class ShoppingCartController : Controller
    {
        private readonly IOrderService orderService;
        public ShoppingCartController( IOrderService orderService)
        {
            this.orderService = orderService;
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult CheckOut()
        {
            return View();
        }
        public ActionResult OrderComplete(string orderId)
        {
            dynamic result = new System.Dynamic.ExpandoObject();
            string base64Decoded;
            byte[] data = System.Convert.FromBase64String(orderId);
            base64Decoded = System.Text.ASCIIEncoding.ASCII.GetString(data);
            var order = orderService.GetOrder(int.Parse(base64Decoded));
            result.orderId = base64Decoded;
            result.customerName = order.CustomerName;
            return View(result);
        }
    }
}