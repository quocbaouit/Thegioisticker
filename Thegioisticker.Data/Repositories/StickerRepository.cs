using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class StickerRepository : RepositoryBase<Sticker>, IStickerRepository
    {
        public StickerRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface IStickerRepository : IRepository<Sticker>
    {

    }
}
