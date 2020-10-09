using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class ProductCategory
    {
        [Key,Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
        [DefaultValue("true")]
        public bool IsActive { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public DateTime? DateDelete { get; set; }
        public virtual List<Product> Products { get; set; }
        public ProductCategory()
        {
            DateCreated = DateTime.Now;
        }
    }
}
