using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;
using System;
using System.Linq;

namespace Thegioisticker.Data.Repositories
{
    public class PageRepository : RepositoryBase<Page>, IPageRepository
    {
        public PageRepository(IDbFactory dbFactory)
            : base(dbFactory) { }

        public Page GetPageByName(string PageName)
        {
            var Page = this.DbContext.Categories.Where(c => c.Name == PageName).FirstOrDefault();

            return Page;
        }

        public override void Update(Page entity)
        {
            entity.DateUpdated = DateTime.Now;
            base.Update(entity);
        }
    }

    public interface IPageRepository : IRepository<Page>
    {
        Page GetPageByName(string PageName);
    }
}
