using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class Product
    {
        [Key,Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, MaxLength(250)]
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string SeoUrl { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }
        [Required]
        [DataType("decimal(8,2)")]
        public decimal Price { get; set; }
        [DataType("decimal(8,2)")]
        public decimal PromotionPrice { get; set; }
        [Required]
        public string Image { get; set; }
        public string Image2 { get; set; }
        public string Image3 { get; set; }
        [DefaultValue("true")]
        public bool IsActive { get; set; }

        [DefaultValue("false")]
        public bool regularProducts { get; set; }
        [Required]
        public int ProductCategoryId { get; set; }
        public ProductCategory ProductCategorys { get; set; }
        public virtual List<OrderDetail> OrderDetail { get; set; }
        public virtual List<ProductSample> ProductSample { get; set; }

        [DefaultValue("false")]
        public bool isDelete { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public DateTime? DateDelete { get; set; }
        public Product()
        {
            DateCreated = DateTime.Now;
        }
    }
}
