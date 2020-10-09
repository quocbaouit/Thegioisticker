using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class Order
    {
        [Key,Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [Required, MaxLength(500)]
        public string CustomerName { get; set; }
        [Required]
        public int CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public Customer Customer { get; set; }
        [Required]
        [DataType("decimal(8,2)")]
        public decimal Total { get; set; }
        [Required, MaxLength(500)]
        public string PayMentMethol { get; set; }
        [DefaultValue("0")]
        public int OrderStatus { get; set; }
        [MaxLength(500)]
        public string Note { get; set; }
        public string CouponName { get; set; }
        public int CouponType { get; set; }
        public float CouponValue { get; set; }
        public float DiscountValue { get; set; }
        public int EmployeeId { get; set; }
        public DateTime? DeliveryDate{ get; set; }
        [DefaultValue("false")]
        public bool IsDelete { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public DateTime? DateDelete { get; set; }
        public virtual List<OrderDetail> OrderDetail { get; set; }
        public Order()
        {
            DateCreated = DateTime.Now;
            OrderDetail = new List<OrderDetail>();
        }
    }
}
