using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class ContentPageRepository : RepositoryBase<ContentPage>, IContentPageRepository
    {
        public ContentPageRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface IContentPageRepository : IRepository<ContentPage>
    {

    }
}
