﻿using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class FaqRepository : RepositoryBase<Faq>, IFaqRepository
    {
        public FaqRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface IFaqRepository : IRepository<Faq>
    {

    }
}
