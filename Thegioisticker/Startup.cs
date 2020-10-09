using Autofac;
using Autofac.Integration.WebApi;
using Autofac.Integration.Mvc;
using Thegioisticker.API.App_Start;
using Thegioisticker.API.Providers;
using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Service;
using Thegioisticker.Web;
using Microsoft.Owin;
using Microsoft.Owin.Security.Facebook;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
using Swashbuckle.Application;
using System;
using System.Reflection;
using System.Web.Http;
using System.Web.Routing;
using System.Configuration;
using Hangfire;

[assembly: OwinStartup(typeof(Thegioisticker.API.Startup))]

namespace Thegioisticker.API
{
    public class Startup
    {
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }
        public static GoogleOAuth2AuthenticationOptions googleAuthOptions { get; private set; }
        public static FacebookAuthenticationOptions facebookAuthOptions { get; private set; }

        public void Configuration(IAppBuilder app)
        {
            string connection_string = ConfigurationManager.ConnectionStrings["ThegioistickerManagerment"].ConnectionString;
            //Hangfire.GlobalConfiguration.Configuration.UseSqlServerStorage(connection_string);
            //app.UseHangfireDashboard();
            //app.UseHangfireServer();
            //RunScheduleJob();
            var builder = new ContainerBuilder();
            builder.RegisterControllers(Assembly.GetExecutingAssembly());
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterType<UnitOfWork>().As<IUnitOfWork>().InstancePerRequest();
            builder.RegisterType<DbFactory>().As<IDbFactory>().InstancePerRequest();

            //// Repositories
            builder.RegisterAssemblyTypes(typeof(CategoryRepository).Assembly)
                .Where(t => t.Name.EndsWith("Repository"))
                .AsImplementedInterfaces().InstancePerRequest();
            // Services
            builder.RegisterAssemblyTypes(typeof(CategoryService).Assembly)
               .Where(t => t.Name.EndsWith("Service"))
               .AsImplementedInterfaces().InstancePerRequest();
            IContainer container = builder.Build();
            System.Web.Http.GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            System.Web.Mvc.DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            HttpConfiguration config = new HttpConfiguration();
            config
    .EnableSwagger(c => c.SingleApiVersion("v1", "sieuviet Web API"))
    .EnableSwaggerUi();
            app.UseAutofacMiddleware(container);
            app.UseAutofacWebApi(config);
            ConfigureOAuth(app);

            WebApiConfig.Register(config);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);
            //Database.SetInitializer(new MigrateDatabaseToLatestVersion<StoreEntities, Thegioisticker.Data.Migrations.Configuration>());
           Bootstrapper.Run();

        }
        public void RunScheduleJob()
        {

            //Run daily 3am, sync all logs to S3
            //RecurringJob.AddOrUpdate(() => logBL.SyncLogToCloud(), "0 19 * * *");
            // run at minute 0, 15, 30, 45 each hour
            //RecurringJob.AddOrUpdate(() => mem_bl.SendPushForMedicationReminder(), "0,15,30,45 * * * *");
            // run every mintute, remind patient to pay booking after booking ended 30 mins or 24 hours
            //RecurringJob.AddOrUpdate(() => mem_bl.SendPushForPaymentReminder(), "0 */1 * * *");
            // Add aia profile, run daily at 18pm to 21pm UTC or 2am to 5am SGT
            //RecurringJob.AddOrUpdate(() => mem_bl.CronJobAddAIAProfile(), "0 18 * * *");
            // Add aia profile, run daily at 18pm UTC or 2am
            //RecurringJob.AddOrUpdate(() => mem_bl.CronJobUpdateAIAProfile(), "0 18 * * *");
        }
        public void ConfigureOAuth(IAppBuilder app)
        {
            //use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(Microsoft.AspNet.Identity.DefaultAuthenticationTypes.ExternalCookie);
            OAuthBearerOptions = new OAuthBearerAuthenticationOptions();

            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions() {
            
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(30),
                Provider = new AuthorizationServerProvider(),
                RefreshTokenProvider = new RefreshTokenProvider()
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(OAuthBearerOptions);

            //Configure Google External Login
            var googleClientId = ConfigurationManager.AppSettings["ClientId"];
            var googleClientSecret = ConfigurationManager.AppSettings["ClientSecret"];
            googleAuthOptions = new GoogleOAuth2AuthenticationOptions()
            {              
                ClientId = googleClientId,
                ClientSecret = googleClientSecret,
                Provider = new GoogleAuthProvider()
            };
            app.UseGoogleAuthentication(googleAuthOptions);

            //Configure Facebook External Login
            var facebookAppId = ConfigurationManager.AppSettings["AppId"];
            var facebookAppSecret = ConfigurationManager.AppSettings["AppSecret"];
            facebookAuthOptions = new FacebookAuthenticationOptions()
            {
                AppId = facebookAppId,
                AppSecret = facebookAppSecret,
                Provider = new FacebookAuthProvider()
            };
            app.UseFacebookAuthentication(facebookAuthOptions);

        }
    }

}