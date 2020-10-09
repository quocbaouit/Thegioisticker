using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class OrderImageRepository : RepositoryBase<OrderImage>, IOrderImageRepository
    {
        public OrderImageRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface IOrderImageRepository : IRepository<OrderImage>
    {

    }
}
