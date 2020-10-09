using FarmWeb.Model;
using System.Data.Entity.ModelConfiguration;

namespace FarmWeb.Data.Configuration
{
    public class ProductCategoryConfiguration : EntityTypeConfiguration<ProductCategory>
    {
        public ProductCategoryConfiguration()
        {
            ToTable("ProductCategory");
            Property(c => c.Name).IsRequired().HasMaxLength(250);
        }
    }
}
