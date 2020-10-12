namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateContentPage : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ContentPages", "SeoUrl", c => c.String());
            AddColumn("dbo.ContentPages", "MetaTitle", c => c.String());
            AddColumn("dbo.ContentPages", "MetaDescription", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ContentPages", "MetaDescription");
            DropColumn("dbo.ContentPages", "MetaTitle");
            DropColumn("dbo.ContentPages", "SeoUrl");
        }
    }
}
