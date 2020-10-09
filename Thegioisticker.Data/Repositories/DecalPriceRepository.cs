using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class DecalPriceRepository : RepositoryBase<DecalPrice>, IDecalPriceRepository
    {
        public DecalPriceRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface IDecalPriceRepository : IRepository<DecalPrice>
    {

    }
}
