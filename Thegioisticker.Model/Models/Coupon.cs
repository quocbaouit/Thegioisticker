using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class Coupon
    {
        [Key,Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(50)]
        public string Code { get; set; }
        public float Amount { get; set; }
        public int Type { get; set; }
        public int Used { get; set; }
        public float Limit { get; set; }

        public int LimitUsed { get; set; }
        [DefaultValue("false")]
        public bool isDelete { get; set; }
        [DefaultValue("true")]
        public bool IsActive { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public DateTime? DateDelete { get; set; }
        public Coupon()
        {
            DateCreated = DateTime.Now;
        }
    }
}
