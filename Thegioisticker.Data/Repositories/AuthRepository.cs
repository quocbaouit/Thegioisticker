using Thegioisticker.Model;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataProtection;

namespace Thegioisticker.Data.Repositories
{
    public class UserModel
    {
        public string Id { get; set; }
        public string FullName { get; set; }
        //[Required]
        //[Display(Name = "User name")]
        public string UserName { get; set; }

        //[Required]
        //[StringLength(100, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 6)]
        //[DataType(DataType.Password)]
        //[Display(Name = "Password")]
        public string Password { get; set; }

        //[DataType(DataType.Password)]
        //[Display(Name = "Confirm password")]
        //[Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string Role { get; set; }
        public string RoleName { get; set; }
    }
    public class ChangePassWordModel
    {
        public string UserId { get; set; }
        public string CurentPassWord { get; set; }

        public string NewPassword { get; set; }
        public string ConfirmNewPassword { get; set; }

    }
    public class RequestPasswordResetViewModel
    {
        public string Email { get; set; }
    }
    
    public class ResetPasswordViewModel
    {
        public string Email
        {
            get;
            set;
        }

        public string Token
        {
            get;
            set;
        }
        public string Password
        {
            get;
            set;
        }
        public string PasswordConfirmation
        {
            get;
            set;
        }
    }
    public class AuthRepository : IDisposable
    {
        private ThegioistickerEntities _ctx;

        private UserManager<ApplicationUser> _userManager;
        private RoleManager<IdentityRole> _roleManager;

        public AuthRepository()
        {
            _ctx = new ThegioistickerEntities();
            //var provider = new DpapiDataProtectionProvider("Thegioisticker");
            _userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(_ctx));
            var provider = new DpapiDataProtectionProvider("YourAppName");
            _userManager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser, string>(provider.Create("UserToken"))
                as IUserTokenProvider<ApplicationUser, string>;
            _roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(_ctx));
        }

        public async Task<IdentityResult> RegisterUser(UserModel userModel,bool isEmployee)
        {
            if (string.IsNullOrEmpty(userModel.RoleName))
            {
                userModel.RoleName = "Khách Hàng";
                isEmployee = false;
            }
            ApplicationUser user = new ApplicationUser
            {
                FullName= userModel.FullName,
                UserName = userModel.UserName,
                Email=userModel.Email,

                Address=userModel.Address,
                PhoneNumber=userModel.PhoneNumber,
               isEmployee= isEmployee,
               RoleName=userModel.RoleName,
            };

            var result = await _userManager.CreateAsync(user, userModel.Password);

            return result;
        }
        public async Task<IdentityResult> ChangePassWord(string userId,string curentPassword, string newPassword)
        {           
            var result = await _userManager.ChangePasswordAsync(userId, curentPassword, newPassword);
            return result;
        }
        public async Task<IdentityResult> UpdateAccount(UpdateUserModal user)
        {
            var userUpdate = _userManager.FindByName(user.UserName);
            userUpdate.FullName = user.FullName;
            userUpdate.Address = user.Address;
            userUpdate.Email = user.Email;
            userUpdate.PhoneNumber = user.PhoneNumber;
            var result = await _userManager.UpdateAsync(userUpdate);
            return result;
        }
        public async Task CreateUserRoles(string userId,string role)
        {
            if (string.IsNullOrEmpty(role))
            {
                role = "user";
            }
            IdentityResult roleResult;
            //Adding Admin Role
            var roleCheck = await _roleManager.RoleExistsAsync(role);
            if (!roleCheck)
            {
                IdentityRole adminRole = new IdentityRole(role);
                //create the roles and seed them to the database
                roleResult = await _roleManager.CreateAsync(adminRole);
                _userManager.AddClaimAsync(userId, new Claim(ClaimTypes.AuthorizationDecision, role)).Wait();
                await _userManager.AddToRoleAsync(userId, role);

            }
            else
            {
                _userManager.AddClaimAsync(userId, new Claim(ClaimTypes.AuthorizationDecision, role)).Wait();
                await _userManager.AddToRoleAsync(userId, role);
            }

        }
        public  List<ApplicationUser> GetUsers()
        {
            var allUser=  _userManager.Users.ToList();
            return allUser;
        }
        
        public async Task<ApplicationUser> FindUser(string userName, string password)
        {
            ApplicationUser user = await _userManager.FindAsync(userName, password);
            return user;
        }
        public void DeleteUser(ApplicationUser user)
        {
            _userManager.Delete(user);
        }
        
        public async Task<ApplicationUser> FindByEmailAsync(string email)
        {
            ApplicationUser user = await _userManager.FindByEmailAsync(email);
            return user;
        }
        public async Task<string> GeneratePasswordResetTokenAsync(string userId)
        {
            try
            {
                string code = await _userManager.GeneratePasswordResetTokenAsync(userId);
                return code;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        
            public async Task<IdentityResult> ResetPassword(string userId, string token, string newPassword)
        {
            var result = await _userManager.ResetPasswordAsync(userId, token, newPassword);

            return result;
        }
        public bool VerifyUserToken(string userId, string curentPassword, string newPassword)
        {
            var result =  _userManager.VerifyUserToken(userId, curentPassword, newPassword);
            return result;
        }
        
        public  List<string> GetUserRoles(string userId)
        {
            var userRoles =  _userManager.GetRoles(userId).ToList();
            return userRoles;
        }
        public Client FindClient(string clientId)
        {
            var client = _ctx.Clients.Find(clientId);

            return client;
        }

        public async Task<bool> AddRefreshToken(RefreshToken token)
        {

           var existingToken = _ctx.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

           if (existingToken != null)
           {
             var result = await RemoveRefreshToken(existingToken);
           }
          
            _ctx.RefreshTokens.Add(token);

            return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<bool> RemoveRefreshToken(string refreshTokenId)
        {
           var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

           if (refreshToken != null) {
               _ctx.RefreshTokens.Remove(refreshToken);
               return await _ctx.SaveChangesAsync() > 0;
           }

           return false;
        }

        public async Task<bool> RemoveRefreshToken(RefreshToken refreshToken)
        {
            _ctx.RefreshTokens.Remove(refreshToken);
             return await _ctx.SaveChangesAsync() > 0;
        }

        public async Task<RefreshToken> FindRefreshToken(string refreshTokenId)
        {
            var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

            return refreshToken;
        }

        public List<RefreshToken> GetAllRefreshTokens()
        {
             return  _ctx.RefreshTokens.ToList();
        }

        public async Task<ApplicationUser> FindAsync(UserLoginInfo loginInfo)
        {
            ApplicationUser user = await _userManager.FindAsync(loginInfo);

            return user;
        }

        public async Task<IdentityResult> CreateAsync(ApplicationUser user)
        {
            var result = await _userManager.CreateAsync(user);

            return result;
        }
        public async Task<IdentityResult> UpdateAsync(ApplicationUser user)
        {
            var result = await _userManager.UpdateAsync(user);
            return result;
        }
        public IdentityResult Update(ApplicationUser user)
        {
            var result =  _userManager.Update(user);
            return result;
        }
        public async Task<ApplicationUser> GetUserByName(string userName)
        {
            var result = await _userManager.FindByNameAsync(userName);
            return result;
        }
        public  ApplicationUser GetUserById(string Id)
        {
            ApplicationUser result =  _userManager.FindById(Id);
            return result;
        }
        public async Task<IdentityResult> AddLoginAsync(string userId, UserLoginInfo login)
        {
            var result = await _userManager.AddLoginAsync(userId, login);

            return result;
        }

        public void Dispose()
        {
            _ctx.Dispose();
            _userManager.Dispose();

        }
    }
}