using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Model;
using System;
using System.Linq;

namespace Thegioisticker.Data.Repositories
{
    public class ShapeRepository : RepositoryBase<Shape>, IShapeRepository
    {
        public ShapeRepository(IDbFactory dbFactory)
            : base(dbFactory) { }

        public Shape GetProductCategoryByName(string Name)
        {
            var result = this.DbContext.Shapes.Where(c => c.Name == Name).FirstOrDefault();

            return result;
        }
    }

    public interface IShapeRepository : IRepository<Shape>
    {
        Shape GetProductCategoryByName(string productCategoryName);
    }
}
