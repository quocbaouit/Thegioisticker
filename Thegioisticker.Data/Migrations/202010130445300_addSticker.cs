namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addSticker : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Stickers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Code = c.String(nullable: false, maxLength: 250),
                        Name = c.String(),
                        SquareFrom = c.Single(),
                        SquareTo = c.Single(),
                        CurtainPrice = c.Single(),
                        NoneCurtainPrice = c.Single(),
                        DefaultPrice = c.Single(),
                        SpecialPrice = c.Single(),
                        isDelete = c.Boolean(nullable: false),
                        CreatedUser = c.Int(),
                        DeletedUser = c.Int(),
                        UpdatedUser = c.Int(),
                        CreatedDate = c.DateTime(),
                        DeletedDate = c.DateTime(),
                        UpdatedDate = c.DateTime(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Stickers");
        }
    }
}
