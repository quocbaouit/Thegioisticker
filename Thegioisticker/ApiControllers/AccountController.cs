using Thegioisticker.API.Models;
using Thegioisticker.API.Results;
using Thegioisticker.Data;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Configuration;
using Thegioisticker.API.Providers;
using System.Web.Hosting;

namespace Thegioisticker.API.Controllers
{
    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {
        private AuthRepository _repo = null;



        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        public AccountController()
        {
            _repo = new AuthRepository();
        }

        // POST api/Account/Register
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            userModel.Role = "admin";
            userModel.RoleName = "Quản Trị Hệ Thống";
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var isEmployee = false;
            if (!string.IsNullOrEmpty(userModel.Role))
            {
                isEmployee = true;
            }
            if (!string.IsNullOrEmpty(userModel.Id))
            {
                var updateUser = _repo.GetUserById(userModel.Id);
                if (updateUser != null)
                {
                    updateUser.FullName = userModel.FullName;
                    updateUser.UserName = userModel.UserName;
                    updateUser.Email = userModel.Email;
                    updateUser.Address = userModel.Address;
                    updateUser.PhoneNumber = userModel.PhoneNumber;
                    _repo.Update(updateUser);
                }

            }
            else
            {
                IdentityResult result = await _repo.RegisterUser(userModel, isEmployee);
                if (result.Succeeded)
                {
                    var userCreated = await _repo.GetUserByName(userModel.UserName);
                    await _repo.CreateUserRoles(userCreated.Id.ToString(), userModel.Role);
                }

                IHttpActionResult errorResult = GetErrorResult(result);

                if (errorResult != null)
                {
                    return errorResult;
                }
            }
            return Ok();
        }
        [Route("changePassword")]
        public async Task<IHttpActionResult> ChangePassWord(ChangePassWordModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IdentityResult result = await _repo.ChangePassWord(userModel.UserId, userModel.CurentPassWord, userModel.NewPassword);
            IHttpActionResult errorResult = GetErrorResult(result);
            if (errorResult != null)
            {
                return errorResult;
            }
            return Ok();
        }
        [Route("updateAccount")]
        public async Task<IHttpActionResult> UpdateAccount(UpdateUserModal userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            IdentityResult result = await _repo.UpdateAccount(userModel);
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest();
        }
        [Route("requestPasswordReset")]
        public async Task<IHttpActionResult> RequestPasswordReset(RequestPasswordResetViewModel model)
        {
            // Validates the received email address based on the view model
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Gets the user entity for the specified email address
            var user = await _repo.FindByEmailAsync(model.Email);
            if (user != null)
            {
                // Generates a password reset token for the user
                string code = await _repo.GeneratePasswordResetTokenAsync(user.Id);
                code = HttpUtility.UrlEncode(code);
                Emailmodel emailmodel = new Emailmodel() { From = ConfigurationManager.AppSettings["Sender"], To = model.Email, Subject = Constants.Contants.ChangePassWordSubject, Body = "" };
                EmailSender emailSender = new EmailSender();
                var callBackUrl = string.Format("https://{0}/doi-mat-khau?token={1}&email={2}",Request.RequestUri.Authority, code, model.Email);
                emailmodel.Body = EmailSender.GetContentResetPassword(HostingEnvironment.MapPath(Constants.Contants.AccountRecoveryTemplateUrl), callBackUrl);
                await emailSender.Execute(emailmodel.From, emailmodel.To, emailmodel.Subject, "", emailmodel.Body);
                return Ok();
            }
            // Displays a view asking the visitor to check their email and click the password reset link
            return BadRequest();
        }


        /// <summary>
        /// Resets the user's password based on the posted data.
        /// Accepts the user ID, password reset token and the new password via the ResetPasswordViewModel.
        /// </summary>
        [Route("resetPassword")]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            // Validates the received password data based on the view model
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            try
            {
                var user = await _repo.FindByEmailAsync(model.Email);
               //var code = HttpUtility.UrlDecode(model.Token);
                IdentityResult result = await _repo.ResetPassword(user.Id, model.Token, model.Password);
                // Changes the user's password if the provided reset token is valid
                if (result.Succeeded)
                {
                    // If the password change was successful, displays a view informing the user
                    return Ok();
                }
                IHttpActionResult errorResult = GetErrorResult(result);
                if (errorResult != null)
                {
                    return errorResult;
                }
                // Occurs if the reset token is invalid
                // Returns a view informing the user that the password reset failed
                return Ok();
            }
            catch (InvalidOperationException)
            {
                // An InvalidOperationException occurs if a user with the given ID is not found
                // Returns a view informing the user that the password reset failed
                return BadRequest();
            }
        }

        [Authorize]
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            return Ok();
        }

        // GET api/Account/ExternalLogin
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            string redirectUri = string.Empty;

            if (error != null)
            {
                return BadRequest(Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            var redirectUriValidationResult = ValidateClientAndRedirectUri(this.Request, ref redirectUri);

            if (!string.IsNullOrWhiteSpace(redirectUriValidationResult))
            {
                return BadRequest(redirectUriValidationResult);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            IdentityUser user = await _repo.FindAsync(new UserLoginInfo(externalLogin.LoginProvider, externalLogin.ProviderKey));

            bool hasRegistered = user != null;

            redirectUri = string.Format("{0}#external_access_token={1}&provider={2}&haslocalaccount={3}&external_user_name={4}",
                                            redirectUri,
                                            externalLogin.ExternalAccessToken,
                                            externalLogin.LoginProvider,
                                            hasRegistered.ToString(),
                                            externalLogin.UserName);

            return Redirect(redirectUri);

        }

        // POST api/Account/RegisterExternal
        [AllowAnonymous]
        [Route("RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var verifiedAccessToken = await VerifyExternalAccessToken(model.Provider, model.ExternalAccessToken);
            if (verifiedAccessToken == null)
            {
                return BadRequest("Invalid Provider or External Access Token");
            }

            ApplicationUser user = await _repo.FindAsync(new UserLoginInfo(model.Provider, verifiedAccessToken.user_id));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                return BadRequest("External user is already registered");
            }

            user = new ApplicationUser() { UserName = model.UserName, FullName = model.FullName };

            IdentityResult result = await _repo.CreateAsync(user);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            var info = new ExternalLoginInfo()
            {
                DefaultUserName = model.UserName,
                Login = new UserLoginInfo(model.Provider, verifiedAccessToken.user_id)
            };

            result = await _repo.AddLoginAsync(user.Id, info.Login);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            //generate access token response
            var accessTokenResponse = GenerateLocalAccessTokenResponse(user.Id, model.UserName, model.FullName, string.Empty, string.Empty, string.Empty);

            return Ok(accessTokenResponse);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("ObtainLocalAccessToken")]
        public async Task<IHttpActionResult> ObtainLocalAccessToken(string provider, string externalAccessToken)
        {

            if (string.IsNullOrWhiteSpace(provider) || string.IsNullOrWhiteSpace(externalAccessToken))
            {
                return BadRequest("Provider or external access token is not sent");
            }

            var verifiedAccessToken = await VerifyExternalAccessToken(provider, externalAccessToken);
            if (verifiedAccessToken == null)
            {
                return BadRequest("Invalid Provider or External Access Token");
            }

            ApplicationUser user = await _repo.FindAsync(new UserLoginInfo(provider, verifiedAccessToken.user_id));

            bool hasRegistered = user != null;

            if (!hasRegistered)
            {
                return BadRequest("External user is not registered");
            }

            //generate access token response
            var accessTokenResponse = GenerateLocalAccessTokenResponse(user.Id, user.UserName, user.FullName, user.Address, user.Email, user.PhoneNumber);

            return Ok(accessTokenResponse);

        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repo.Dispose();
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (var error in result.Errors)
                    {
                        if (error.StartsWith("Name"))
                        {
                            var NameToEmail = Regex.Replace(error, "is already taken", "đã tồn tại");
                            ModelState.AddModelError("", NameToEmail);
                        }
                        else if (error.StartsWith("User name"))
                        {
                            var passWord = Regex.Replace(error, "is invalid, can only contain letters or digits", "không hợp lệ,tên đăng nhập phải viết liền không dấu");
                            ModelState.AddModelError("", passWord);
                        }
                        else if (error.StartsWith("Passwords"))
                        {
                            var passWord = Regex.Replace(error, "must be at least 6 characters", "phải ít nhất 6 ký tự");
                            ModelState.AddModelError("", passWord);
                        }
                        else
                        {
                            ModelState.AddModelError("", "Vui lòng thử lại sau");
                        }
                    }

                    //foreach (string error in result.Errors)
                    //{
                    //    ModelState.AddModelError("", error);
                    //}
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private string ValidateClientAndRedirectUri(HttpRequestMessage request, ref string redirectUriOutput)
        {

            Uri redirectUri;

            var redirectUriString = GetQueryString(Request, "redirect_uri");

            if (string.IsNullOrWhiteSpace(redirectUriString))
            {
                return "redirect_uri is required";
            }

            bool validUri = Uri.TryCreate(redirectUriString, UriKind.Absolute, out redirectUri);

            if (!validUri)
            {
                return "redirect_uri is invalid";
            }

            var clientId = GetQueryString(Request, "client_id");

            if (string.IsNullOrWhiteSpace(clientId))
            {
                return "client_Id is required";
            }

            var client = _repo.FindClient(clientId);

            if (client == null)
            {
                return string.Format("Client_id '{0}' is not registered in the system.", clientId);
            }

            //if (!string.Equals(client.AllowedOrigin, redirectUri.GetLeftPart(UriPartial.Authority), StringComparison.OrdinalIgnoreCase))
            //{
            //    return string.Format("The given URL is not allowed by Client_id '{0}' configuration.", clientId);
            //}

            redirectUriOutput = redirectUri.AbsoluteUri;

            return string.Empty;

        }

        private string GetQueryString(HttpRequestMessage request, string key)
        {
            var queryStrings = request.GetQueryNameValuePairs();

            if (queryStrings == null) return null;

            var match = queryStrings.FirstOrDefault(keyValue => string.Compare(keyValue.Key, key, true) == 0);

            if (string.IsNullOrEmpty(match.Value)) return null;

            return match.Value;
        }

        private async Task<ParsedExternalAccessToken> VerifyExternalAccessToken(string provider, string accessToken)
        {
            ParsedExternalAccessToken parsedToken = null;

            var verifyTokenEndPoint = "";

            if (provider == "Facebook")
            {
                var appToken = ConfigurationManager.AppSettings["AppToken"];
                verifyTokenEndPoint = string.Format("https://graph.facebook.com/debug_token?input_token={0}&access_token={1}", accessToken, appToken);
            }
            else if (provider == "Google")
            {
                verifyTokenEndPoint = string.Format("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={0}", accessToken);
            }
            else
            {
                return null;
            }

            var client = new HttpClient();
            var uri = new Uri(verifyTokenEndPoint);
            var response = await client.GetAsync(uri);

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();

                dynamic jObj = (JObject)Newtonsoft.Json.JsonConvert.DeserializeObject(content);

                parsedToken = new ParsedExternalAccessToken();

                if (provider == "Facebook")
                {
                    parsedToken.user_id = jObj["data"]["user_id"];
                    parsedToken.app_id = jObj["data"]["app_id"];

                    if (!string.Equals(Startup.facebookAuthOptions.AppId, parsedToken.app_id, StringComparison.OrdinalIgnoreCase))
                    {
                        return null;
                    }
                }
                else if (provider == "Google")
                {
                    parsedToken.user_id = jObj["user_id"];
                    parsedToken.app_id = jObj["audience"];

                    if (!string.Equals(Startup.googleAuthOptions.ClientId, parsedToken.app_id, StringComparison.OrdinalIgnoreCase))
                    {
                        return null;
                    }

                }

            }

            return parsedToken;
        }

        private JObject GenerateLocalAccessTokenResponse(string Id, string userName, string fullName, string address, string email, string phoneNumber)
        {

            var tokenExpiration = TimeSpan.FromDays(1);
            var userRoles = _repo.GetUserRoles(Id);
            ClaimsIdentity identity = new ClaimsIdentity(OAuthDefaults.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, userName));
            var isAdmin = userRoles.Contains("Admin") ? "true" : "false";
            if (userRoles.Count > 0)
            {
                foreach (var role in userRoles)
                {
                    identity.AddClaim(new Claim(ClaimTypes.Role, role));
                }
            }
            else
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, "user"));
                userRoles.Add("user");
            }
            identity.AddClaim(new Claim("sub", userName));

            var props = new AuthenticationProperties()
            {
                IssuedUtc = DateTime.UtcNow,
                ExpiresUtc = DateTime.UtcNow.Add(tokenExpiration),
            };

            var ticket = new AuthenticationTicket(identity, props);

            var accessToken = Startup.OAuthBearerOptions.AccessTokenFormat.Protect(ticket);

            JObject tokenResponse = new JObject(
                                        new JProperty("userName", userName),
                                        new JProperty("id", Id),
                                        new JProperty("fullName", fullName),
                                        new JProperty("isAdmin", isAdmin),
                                        new JProperty("address", address),
                                        new JProperty("email", email),
                                        new JProperty("phoneNumber", phoneNumber),
                                        new JProperty("access_token", accessToken),
                                        new JProperty("token_type", "bearer"),
                                        new JProperty("expires_in", tokenExpiration.TotalSeconds.ToString()),
                                        new JProperty(".issued", ticket.Properties.IssuedUtc.ToString()),
                                        new JProperty(".expires", ticket.Properties.ExpiresUtc.ToString())
        );

            return tokenResponse;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }
            public string ExternalAccessToken { get; set; }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer) || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name),
                    ExternalAccessToken = identity.FindFirstValue("ExternalAccessToken"),
                };
            }
        }

        #endregion
    }
}
