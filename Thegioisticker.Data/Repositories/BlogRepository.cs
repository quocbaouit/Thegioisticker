using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class BlogRepository : RepositoryBase<Blog>, IBlogRepository
    {
        public BlogRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface IBlogRepository : IRepository<Blog>
    {

    }
}
