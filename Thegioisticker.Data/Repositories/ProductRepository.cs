using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;

namespace Thegioisticker.Data.Repositories
{
    public class ProductRepository : RepositoryBase<Product>, IProductRepository
    {
        public ProductRepository(IDbFactory dbFactory)
            : base(dbFactory) { }
    }

    public interface IProductRepository : IRepository<Product>
    {

    }
}
