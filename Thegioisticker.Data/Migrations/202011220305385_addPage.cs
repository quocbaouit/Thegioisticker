namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addPage : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.Categories", newName: "Pages");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.Pages", newName: "Categories");
        }
    }
}
