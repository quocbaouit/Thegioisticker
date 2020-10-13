namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addImageToProductCategory : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ProductCategories", "Image", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ProductCategories", "Image");
        }
    }
}
