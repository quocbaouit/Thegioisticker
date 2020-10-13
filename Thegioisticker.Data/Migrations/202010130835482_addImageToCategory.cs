namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addImageToCategory : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Categories", "Image", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Categories", "Image");
        }
    }
}
