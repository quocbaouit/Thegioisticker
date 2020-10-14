namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addUrlToProductCategory : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ProductCategories", "Url", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ProductCategories", "Url");
        }
    }
}
