using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class SettingRepository : RepositoryBase<Setting>, ISettingRepository
    {
        public SettingRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface ISettingRepository : IRepository<Setting>
    {

    }
}
