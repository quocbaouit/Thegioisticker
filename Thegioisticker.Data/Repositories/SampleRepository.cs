using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class SampleRepository : RepositoryBase<Sample>, ISampleRepository
    {
        public SampleRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface ISampleRepository : IRepository<Sample>
    {

    }
}
