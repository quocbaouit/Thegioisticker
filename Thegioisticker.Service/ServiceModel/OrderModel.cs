using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Text;
using System.Threading.Tasks;

namespace Thegioisticker.Service
{
    public class ProductModel
    {
        public string Category { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; }
        public int Id { get; set; }
        public string TransactionId { get; set; }

        public string Name { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public string Machining { get; set; }
        public string Cut { get; set; }
        public string CutType { get; set; }
        public string FileDescription { get; set; }
        public int FileType { get; set; }
        public int FileId { get; set; }
        public string SettingModal { get; set; }
        public string Image { get; set; }

        public decimal SubTotal { get; set; }

        public string Note { get; set; }
        public int DeliveryDate { get; set; }
        public string CouponName { get; set; }
        public int CouponType { get; set; }
        public float CouponValue { get; set; }
        public float DiscountValue { get; set; }

       
    }
    public class CustomerModel
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
    }
    public class OrderModel
    {
        public  List<ProductModel>Products { get; set; }
        public CustomerModel Customer { get; set; }
        public string Note { get; set; }
        public string PayMentMethol { get; set; }
        public string CouponName { get; set; }
        public float DiscountValue { get; set; }

        public int CouponType { get; set; }
        public decimal Total { get; set; }
    }
}
