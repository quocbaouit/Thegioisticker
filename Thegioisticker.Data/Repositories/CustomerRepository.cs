using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;
using System.Linq;

namespace Thegioisticker.Data.Repositories
{
    public class CustomerRepository : RepositoryBase<Customer>, ICustomerRepository
    {
        public CustomerRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
        public Customer GetCustomerByUserId(string userId)
        {
            var category = this.DbContext.Customer.Where(c => c.UserId == userId).FirstOrDefault();
            return category;
        }
    }

    public interface ICustomerRepository : IRepository<Customer>
    {
        Customer GetCustomerByUserId(string userId);
    }
}
