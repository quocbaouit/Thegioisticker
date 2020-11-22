namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addCategory : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Categories", "ParentId", c => c.Int(nullable: false));
            AddColumn("dbo.Categories", "SeoUrl", c => c.String());
            AddColumn("dbo.Categories", "MetaTitle", c => c.String());
            AddColumn("dbo.Categories", "MetaDescription", c => c.String());
            AddColumn("dbo.Categories", "Content", c => c.String());
            AddColumn("dbo.Categories", "isDelete", c => c.Boolean(nullable: false));
            AddColumn("dbo.Categories", "DateDelete", c => c.DateTime());
            DropColumn("dbo.Categories", "Test");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Categories", "Test", c => c.String());
            DropColumn("dbo.Categories", "DateDelete");
            DropColumn("dbo.Categories", "isDelete");
            DropColumn("dbo.Categories", "Content");
            DropColumn("dbo.Categories", "MetaDescription");
            DropColumn("dbo.Categories", "MetaTitle");
            DropColumn("dbo.Categories", "SeoUrl");
            DropColumn("dbo.Categories", "ParentId");
        }
    }
}
