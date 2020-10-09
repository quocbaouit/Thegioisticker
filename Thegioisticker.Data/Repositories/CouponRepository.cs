using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class CouponRepository : RepositoryBase<Coupon>, ICouponRepository
    {
        public CouponRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface ICouponRepository : IRepository<Coupon>
    {

    }
}
