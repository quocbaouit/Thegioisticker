using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;
using System;
using System.Linq;

namespace Thegioisticker.Data.Repositories
{
    public class ProductCategoryRepository : RepositoryBase<ProductCategory>, IProductCategoryRepository
    {
        public ProductCategoryRepository(IDbFactory dbFactory)
            : base(dbFactory) { }

        public ProductCategory GetProductCategoryByName(string productCategoryName)
        {
            var productCategory = this.DbContext.ProductCategories.Where(c => c.Name == productCategoryName).FirstOrDefault();

            return productCategory;
        }

        public override void Update(ProductCategory entity)
        {
            entity.DateUpdated = DateTime.Now;
            base.Update(entity);
        }
    }

    public interface IProductCategoryRepository : IRepository<ProductCategory>
    {
        ProductCategory GetProductCategoryByName(string productCategoryName);
    }
}
