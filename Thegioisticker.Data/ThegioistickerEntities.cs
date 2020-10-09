using Thegioisticker.Model;
using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Thegioisticker.Data
{
    public class ThegioistickerEntities : IdentityDbContext<ApplicationUser>
    {
        public ThegioistickerEntities() : base("ThegioistickerManagerment") { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductCategory> ProductCategories { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderDetail> OrderDetail { get; set; }
        public DbSet<Blog> Blog { get; set; }
        public DbSet<Company> Company { get; set; }
        public DbSet<Faq> Faq { get; set; }
        public DbSet<Testimonial> Testimonial { get; set; }
        public DbSet<Customer> Customer { get; set; }
        public DbSet<DecalPrice> DecalPrice { get; set; }
        public DbSet<Sample> Samples { get; set; }
        public DbSet<Shape> Shapes { get; set; }
        public DbSet<OrderImage> OrderImages { get; set; }
        public DbSet<ProductSample> ProductSample { get; set; }
        public DbSet<ContentPage> ContentPage { get; set; }
        public DbSet<Coupon> Coupon { get; set; }
        public DbSet<Setting> Setting { get; set; }
        public virtual void Commit()
        {
            base.SaveChanges();
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<IdentityUserLogin>().HasKey<string>(l => l.UserId);
            modelBuilder.Entity<IdentityRole>().HasKey<string>(r => r.Id);
            modelBuilder.Entity<IdentityUserRole>().HasKey(r => new { r.RoleId, r.UserId });
        }
    }
}
