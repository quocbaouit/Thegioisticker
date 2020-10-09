using Microsoft.AspNet.Identity.EntityFramework;
using System.Collections.Generic;
using System.ComponentModel;

namespace Thegioisticker.Model
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
        public string Address { get; set; }
        [DefaultValue("false")]
        public bool isEmployee { get; set; }

        public string RoleName { get; set; }
    }

    public class UpdateUserModal
    {
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
