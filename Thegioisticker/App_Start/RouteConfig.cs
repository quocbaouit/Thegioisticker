using System.Security.Policy;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Thegioisticker.Web
{
    public class GetSEOFriendlyRoute : Route
    {
        public GetSEOFriendlyRoute(string url, RouteValueDictionary defaults, IRouteHandler routeHandler) : base(url, defaults, routeHandler)
        {
        }

        public override RouteData GetRouteData(HttpContextBase httpContext)
        {
            var routeData = base.GetRouteData(httpContext);

            if (routeData != null)
            {
                if (routeData.Values.ContainsKey("id"))
                    routeData.Values["id"] = GetIdValue(routeData.Values["id"]);
            }

            return routeData;
        }

        private object GetIdValue(object id)
        {
            if (id != null)
            {
                string idValue = id.ToString();

                var regex = new Regex(@"^(?<id>\d+).*$");
                var match = regex.Match(idValue);

                if (match.Success)
                {
                    return match.Groups["id"].Value;
                }
            }

            return id;
        }
    }
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                "Static Routes",
                "",
                new { controller = "Home", action = "Index" }
                );
            routes.MapRoute(
                name: "Product",
                url: "san-pham",
                defaults: new { controller = "Product", action = "Index" }
               );
            routes.MapRoute(
                name: "Sticker",
                url: "san-pham-tem",
                defaults: new { controller = "Product", action = "Sticker" }
               );
            routes.MapRoute(
                name: "ProductDetail",
                url: "chi-tiet-san-pham/{seoUrl}",
                defaults: new { controller = "Product", action = "ProductDetail" }
               );
            routes.MapRoute(
                name: "FAQ",
                url: "cau-hoi-thuong-gap",
                defaults: new { controller = "FAQ", action = "Index" }
               );
            routes.MapRoute(
                name: "Error",
                url: "not-found",
                defaults: new { controller = "Error", action = "Index" }
               );
            routes.MapRoute(
                name: "Invoice",
                url: "bao-gia-nhanh",
                defaults: new { controller = "Invoice", action = "Index" }
               );
            routes.MapRoute(
                name: "ProductGallery",
                url: "thu-vien-decal",
                defaults: new { controller = "Product", action = "ProductGallery" }
               );
            routes.MapRoute(
                name: "Editor",
                url: "chinh-sua-mau",
                defaults: new { controller = "Editor", action = "Index" }
               );
            routes.MapRoute(
                name: "User",
                url: "user",
                defaults: new { controller = "User", action = "Index" }
               );
            routes.MapRoute(
                name: "UserResetPass",
                url: "doi-mat-khau",
                defaults: new { controller = "User", action = "ResetPassword" }
               );
            routes.MapRoute(
                name: "ShoppingCart",
                url: "gio-hang",
                defaults: new { controller = "ShoppingCart", action = "Index" }
               );
            routes.MapRoute(
                name: "CheckOut",
                url: "thanh-toan",
                defaults: new { controller = "ShoppingCart", action = "CheckOut" }
               );
            routes.MapRoute(
                name: "Complete",
                url: "hoan-tat-don-hang",
                defaults: new { controller = "ShoppingCart", action = "OrderComplete" }
               );
            routes.MapRoute(
                name: "BLOG",
                url: "thong-tin",
                defaults: new { controller = "Blog", action = "Index" }
               );
            routes.MapRoute(
                name: "BlogDetail",
                url: "thong-tin-chi-tiet/{seoUrl}",
                defaults: new { controller = "Blog", action = "BlogDetail", seoUrl = "" }
               );
            routes.MapRoute(
                name: "Company",
                url: "cong-ty/{seoUrl}", 
                defaults: new { controller = "Company", action = "Index" }
               );
            routes.MapRoute(
                name: "CampanyContact",
                url: "lien-he",
                defaults: new { controller = "Company", action = "Contact" }
               );
            routes.MapRoute(
                name: "Home",
                url: "",
                defaults: new { controller = "Home", action = "Index" }
               );
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
