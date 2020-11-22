using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class OrderDetail
    {
        [Key,Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
        
        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        [Required]
        public int ProductId { get; set; }
        public string TransactionId { get; set; }
        [Required, MaxLength(250)]
        public string ProductName { get; set; }
        public Product Product { get; set; }

        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public string Machining { get; set; }
        public string Cut { get; set; }
        public string CutType { get; set; }
        public string FileDescription { get; set; }
        public int FileType { get; set; }
        public int FileId { get; set; }
        public string SettingModal { get; set; }
        public string Image { get; set; }

        [Required]
        [DataType("decimal(8,2)")]
        public decimal Price { get; set; }
        [Required]
        [DataType("decimal(8,2)")]
        public decimal Quantity { get; set; }
        [Required]
        [DataType("decimal(8,2)")]
        public decimal SubTotal { get; set; }

        public string Note { get; set; }
        public int DeliveryDate { get; set; }
        public string CouponName { get; set; }
        public int CouponType { get; set; }
        public float CouponValue { get; set; }
        public float DiscountValue { get; set; }

        public DateTime? StartContract { get; set; }
        public DateTime? EndContract { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public DateTime? DateDelete { get; set; }
        public OrderDetail()
        {
            DateCreated = DateTime.Now;
        }
    }
}
