using FarmWeb.Model;
using System.Data.Entity.ModelConfiguration;

namespace FarmWeb.Data.Configuration
{
    public class CategoryConfiguration : EntityTypeConfiguration<Category>
    {
        public CategoryConfiguration()
        {
            ToTable("Categories");
            Property(c => c.Name).IsRequired().HasMaxLength(50);
        }
    }
}
