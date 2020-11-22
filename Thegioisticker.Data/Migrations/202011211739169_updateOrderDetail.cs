namespace Thegioisticker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateOrderDetail : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.OrderDetails", "Note", c => c.String());
            AddColumn("dbo.OrderDetails", "DeliveryDate", c => c.Int(nullable: false));
            AddColumn("dbo.OrderDetails", "CouponName", c => c.String());
            AddColumn("dbo.OrderDetails", "CouponType", c => c.Int(nullable: false));
            AddColumn("dbo.OrderDetails", "CouponValue", c => c.Single(nullable: false));
            AddColumn("dbo.OrderDetails", "DiscountValue", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.OrderDetails", "DiscountValue");
            DropColumn("dbo.OrderDetails", "CouponValue");
            DropColumn("dbo.OrderDetails", "CouponType");
            DropColumn("dbo.OrderDetails", "CouponName");
            DropColumn("dbo.OrderDetails", "DeliveryDate");
            DropColumn("dbo.OrderDetails", "Note");
        }
    }
}
