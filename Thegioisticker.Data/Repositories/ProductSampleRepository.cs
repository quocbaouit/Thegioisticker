using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;
using System;
using System.Linq;

namespace Thegioisticker.Data.Repositories
{
    public class ProductSampleRepository : RepositoryBase<ProductSample>, IProductSampleRepository
    {
        public ProductSampleRepository(IDbFactory dbFactory)
            : base(dbFactory) { }

        public Shape GetProductCategoryByName(string Name)
        {
            var result = this.DbContext.Shapes.Where(c => c.Name == Name).FirstOrDefault();

            return result;
        }
    }

    public interface IProductSampleRepository : IRepository<ProductSample>
    {
        Shape GetProductCategoryByName(string productCategoryName);
    }
}
