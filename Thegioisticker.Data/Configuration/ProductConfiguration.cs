using FarmWeb.Model;
using System.Data.Entity.ModelConfiguration;

namespace FarmWeb.Data.Configuration
{
    public class ProductConfiguration : EntityTypeConfiguration<Product>
    {
        public ProductConfiguration()
        {
            ToTable("Product");
            Property(g => g.Name).IsRequired().HasMaxLength(250);
            Property(g => g.Price).IsRequired().HasPrecision(8, 2);
            Property(g => g.PromotionPrice).IsRequired().HasPrecision(8, 2);
            Property(g => g.ProductCategoryId).IsRequired();
        }
    }
}
