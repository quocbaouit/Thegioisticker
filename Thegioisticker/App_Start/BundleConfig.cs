using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Optimization;

namespace Thegioisticker.Web
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/fonts/fonts.css",
                "~/Content/fonts/themify-icons.css",
                "~/Content/fonts/fonts-google.css",
                "~/Content/vendor-css/font-awesome/css/font-awesome.min.css",
                "~/Content/css/main_styles.css",
                "~/Content/css/responsive.css",
                "~/Content/login-register.css",
                "~/Content/css/angular-ui-notification.min.css",
                "~/Scripts/plugins/slick-1.8.0/slick.css",
                "~/Content/formValidation.min.css"));

            BundleTable.EnableOptimizations = false;
        }
    }
}