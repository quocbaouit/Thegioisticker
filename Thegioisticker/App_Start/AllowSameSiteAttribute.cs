using System.Web.Mvc;

public class AllowSameSiteAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        var response = filterContext.RequestContext.HttpContext.Response;

        if (response != null)
        {
            response.AddHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
        }

        base.OnActionExecuting(filterContext);
    }
}