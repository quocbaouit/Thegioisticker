using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;
using System.Linq;

namespace Thegioisticker.Data.Repositories
{
    public class EmployeeRepository : RepositoryBase<ApplicationUser>, IEmployeeRepository
    {
        public EmployeeRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
        public ApplicationUser GetEmployeeByUserId(string userId)
        {
            var emp = this.DbContext.Users.Where(c => c.Id == userId).FirstOrDefault();
            return emp;
        }
    }

    public interface IEmployeeRepository : IRepository<ApplicationUser>
    {
        ApplicationUser GetEmployeeByUserId(string userId);
    }
}
