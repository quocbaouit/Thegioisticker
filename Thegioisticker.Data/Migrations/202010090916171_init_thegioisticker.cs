namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init_thegioisticker : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Blogs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        Author = c.String(),
                        Description = c.String(),
                        SeoUrl = c.String(),
                        MetaTitle = c.String(),
                        MetaDescription = c.String(),
                        Image = c.String(),
                        Content = c.String(),
                        isInHomePage = c.Boolean(nullable: false),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Categories",
                c => new
                    {
                        CategoryID = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        Test = c.String(),
                    })
                .PrimaryKey(t => t.CategoryID);
            
            CreateTable(
                "dbo.Clients",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Secret = c.String(),
                        Name = c.String(),
                        ApplicationType = c.Int(nullable: false),
                        Active = c.Boolean(nullable: false),
                        RefreshTokenLifeTime = c.Int(nullable: false),
                        AllowedOrigin = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Companies",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 250),
                        Email = c.String(maxLength: 250),
                        Phone = c.String(maxLength: 500),
                        Address = c.String(),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ContentPages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        Description = c.String(),
                        Content = c.String(),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Coupons",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 250),
                        Code = c.String(maxLength: 50),
                        Amount = c.Single(nullable: false),
                        Type = c.Int(nullable: false),
                        Used = c.Int(nullable: false),
                        Limit = c.Single(nullable: false),
                        LimitUsed = c.Int(nullable: false),
                        isDelete = c.Boolean(nullable: false),
                        IsActive = c.Boolean(nullable: false),
                        StartDate = c.DateTime(),
                        EndDate = c.DateTime(),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Customers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        FullName = c.String(nullable: false),
                        Email = c.String(),
                        Address = c.String(),
                        PhoneNumber = c.String(),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ApplicationUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.Orders",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CustomerName = c.String(nullable: false, maxLength: 500),
                        CustomerId = c.Int(nullable: false),
                        Total = c.Decimal(nullable: false, precision: 18, scale: 2),
                        PayMentMethol = c.String(nullable: false, maxLength: 500),
                        OrderStatus = c.Int(nullable: false),
                        Note = c.String(maxLength: 500),
                        CouponName = c.String(),
                        CouponType = c.Int(nullable: false),
                        CouponValue = c.Single(nullable: false),
                        DiscountValue = c.Single(nullable: false),
                        EmployeeId = c.Int(nullable: false),
                        DeliveryDate = c.DateTime(),
                        IsDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Customers", t => t.CustomerId, cascadeDelete: true)
                .Index(t => t.CustomerId);
            
            CreateTable(
                "dbo.OrderDetails",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Description = c.String(maxLength: 500),
                        OrderId = c.Int(nullable: false),
                        ProductId = c.Int(nullable: false),
                        TransactionId = c.String(),
                        ProductName = c.String(nullable: false, maxLength: 250),
                        Width = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Height = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Machining = c.String(),
                        Cut = c.String(),
                        CutType = c.String(),
                        FileDescription = c.String(),
                        FileType = c.Int(nullable: false),
                        FileId = c.Int(nullable: false),
                        SettingModal = c.String(),
                        Image = c.String(),
                        Price = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Quantity = c.Decimal(nullable: false, precision: 18, scale: 2),
                        SubTotal = c.Decimal(nullable: false, precision: 18, scale: 2),
                        StartContract = c.DateTime(),
                        EndContract = c.DateTime(),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Orders", t => t.OrderId, cascadeDelete: true)
                .ForeignKey("dbo.Products", t => t.ProductId, cascadeDelete: true)
                .Index(t => t.OrderId)
                .Index(t => t.ProductId);
            
            CreateTable(
                "dbo.Products",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 250),
                        Code = c.String(),
                        Description = c.String(),
                        SeoUrl = c.String(),
                        MetaTitle = c.String(),
                        MetaDescription = c.String(),
                        Price = c.Decimal(nullable: false, precision: 18, scale: 2),
                        PromotionPrice = c.Decimal(nullable: false, precision: 18, scale: 2),
                        Image = c.String(nullable: false),
                        Image2 = c.String(),
                        Image3 = c.String(),
                        IsActive = c.Boolean(nullable: false),
                        regularProducts = c.Boolean(nullable: false),
                        ProductCategoryId = c.Int(nullable: false),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ProductCategories", t => t.ProductCategoryId, cascadeDelete: true)
                .Index(t => t.ProductCategoryId);
            
            CreateTable(
                "dbo.ProductCategories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 250),
                        Description = c.String(maxLength: 500),
                        IsActive = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ProductSamples",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ProductId = c.Int(nullable: false),
                        SampleId = c.Int(nullable: false),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Products", t => t.ProductId, cascadeDelete: true)
                .ForeignKey("dbo.Samples", t => t.SampleId, cascadeDelete: true)
                .Index(t => t.ProductId)
                .Index(t => t.SampleId);
            
            CreateTable(
                "dbo.Samples",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 250),
                        Code = c.String(),
                        Description = c.String(maxLength: 500),
                        SeoUrl = c.String(),
                        Image = c.String(nullable: false),
                        JsonDesign = c.String(),
                        IsActive = c.Boolean(nullable: false),
                        ShapeId = c.Int(nullable: false),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Shapes", t => t.ShapeId, cascadeDelete: true)
                .Index(t => t.ShapeId);
            
            CreateTable(
                "dbo.Shapes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 250),
                        Code = c.String(maxLength: 50),
                        Description = c.String(maxLength: 500),
                        Image = c.String(),
                        IsActive = c.Boolean(nullable: false),
                        IsDeleted = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ApplicationUsers",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        FullName = c.String(),
                        Address = c.String(),
                        isEmployee = c.Boolean(nullable: false),
                        RoleName = c.String(),
                        Email = c.String(),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.IdentityUserClaims",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                        ApplicationUser_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ApplicationUsers", t => t.ApplicationUser_Id)
                .Index(t => t.ApplicationUser_Id);
            
            CreateTable(
                "dbo.IdentityUserLogins",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        LoginProvider = c.String(),
                        ProviderKey = c.String(),
                        ApplicationUser_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.UserId)
                .ForeignKey("dbo.ApplicationUsers", t => t.ApplicationUser_Id)
                .Index(t => t.ApplicationUser_Id);
            
            CreateTable(
                "dbo.IdentityUserRoles",
                c => new
                    {
                        RoleId = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ApplicationUser_Id = c.String(maxLength: 128),
                        IdentityRole_Id = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => new { t.RoleId, t.UserId })
                .ForeignKey("dbo.ApplicationUsers", t => t.ApplicationUser_Id)
                .ForeignKey("dbo.IdentityRoles", t => t.IdentityRole_Id)
                .Index(t => t.ApplicationUser_Id)
                .Index(t => t.IdentityRole_Id);
            
            CreateTable(
                "dbo.DecalPrices",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Description = c.String(nullable: false, maxLength: 250),
                        Quantity = c.Single(nullable: false),
                        Price = c.Single(nullable: false),
                        PrintPrice = c.Single(nullable: false),
                        CutPrice = c.Single(nullable: false),
                        MachiningPrice = c.Single(nullable: false),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Faqs",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Question = c.String(nullable: false, maxLength: 250),
                        Answer = c.String(),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.OrderImages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Image = c.String(),
                        ProductId = c.Int(),
                        TransactionId = c.String(),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.RefreshTokens",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Subject = c.String(),
                        ClientId = c.String(),
                        IssuedUtc = c.DateTime(nullable: false),
                        ExpiresUtc = c.DateTime(nullable: false),
                        ProtectedTicket = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.IdentityRoles",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Settings",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Code = c.String(),
                        Name = c.String(nullable: false, maxLength: 250),
                        Type = c.String(),
                        SettingValue = c.String(),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Testimonials",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false, maxLength: 250),
                        Job = c.String(maxLength: 250),
                        TestimonialText = c.String(maxLength: 500),
                        Image = c.String(),
                        isDelete = c.Boolean(nullable: false),
                        DateCreated = c.DateTime(),
                        DateUpdated = c.DateTime(),
                        DateDelete = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.IdentityUserRoles", "IdentityRole_Id", "dbo.IdentityRoles");
            DropForeignKey("dbo.Customers", "UserId", "dbo.ApplicationUsers");
            DropForeignKey("dbo.IdentityUserRoles", "ApplicationUser_Id", "dbo.ApplicationUsers");
            DropForeignKey("dbo.IdentityUserLogins", "ApplicationUser_Id", "dbo.ApplicationUsers");
            DropForeignKey("dbo.IdentityUserClaims", "ApplicationUser_Id", "dbo.ApplicationUsers");
            DropForeignKey("dbo.ProductSamples", "SampleId", "dbo.Samples");
            DropForeignKey("dbo.Samples", "ShapeId", "dbo.Shapes");
            DropForeignKey("dbo.ProductSamples", "ProductId", "dbo.Products");
            DropForeignKey("dbo.Products", "ProductCategoryId", "dbo.ProductCategories");
            DropForeignKey("dbo.OrderDetails", "ProductId", "dbo.Products");
            DropForeignKey("dbo.OrderDetails", "OrderId", "dbo.Orders");
            DropForeignKey("dbo.Orders", "CustomerId", "dbo.Customers");
            DropIndex("dbo.IdentityUserRoles", new[] { "IdentityRole_Id" });
            DropIndex("dbo.IdentityUserRoles", new[] { "ApplicationUser_Id" });
            DropIndex("dbo.IdentityUserLogins", new[] { "ApplicationUser_Id" });
            DropIndex("dbo.IdentityUserClaims", new[] { "ApplicationUser_Id" });
            DropIndex("dbo.Samples", new[] { "ShapeId" });
            DropIndex("dbo.ProductSamples", new[] { "SampleId" });
            DropIndex("dbo.ProductSamples", new[] { "ProductId" });
            DropIndex("dbo.Products", new[] { "ProductCategoryId" });
            DropIndex("dbo.OrderDetails", new[] { "ProductId" });
            DropIndex("dbo.OrderDetails", new[] { "OrderId" });
            DropIndex("dbo.Orders", new[] { "CustomerId" });
            DropIndex("dbo.Customers", new[] { "UserId" });
            DropTable("dbo.Testimonials");
            DropTable("dbo.Settings");
            DropTable("dbo.IdentityRoles");
            DropTable("dbo.RefreshTokens");
            DropTable("dbo.OrderImages");
            DropTable("dbo.Faqs");
            DropTable("dbo.DecalPrices");
            DropTable("dbo.IdentityUserRoles");
            DropTable("dbo.IdentityUserLogins");
            DropTable("dbo.IdentityUserClaims");
            DropTable("dbo.ApplicationUsers");
            DropTable("dbo.Shapes");
            DropTable("dbo.Samples");
            DropTable("dbo.ProductSamples");
            DropTable("dbo.ProductCategories");
            DropTable("dbo.Products");
            DropTable("dbo.OrderDetails");
            DropTable("dbo.Orders");
            DropTable("dbo.Customers");
            DropTable("dbo.Coupons");
            DropTable("dbo.ContentPages");
            DropTable("dbo.Companies");
            DropTable("dbo.Clients");
            DropTable("dbo.Categories");
            DropTable("dbo.Blogs");
        }
    }
}
