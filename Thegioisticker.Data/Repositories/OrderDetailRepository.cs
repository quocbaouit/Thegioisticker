using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class OrderDetailRepository : RepositoryBase<OrderDetail>, IOrderDetailRepository
    {
        public OrderDetailRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface IOrderDetailRepository : IRepository<OrderDetail>
    {

    }
}
