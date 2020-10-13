namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class productId : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Stickers", "ProductId", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Stickers", "ProductId");
        }
    }
}
