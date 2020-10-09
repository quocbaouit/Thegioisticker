using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class Sample
    {
        [Key,Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, MaxLength(250)]
        public string Name { get; set; }
        public string Code { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
        public string SeoUrl { get; set; }
        [Required]
        public string Image { get; set; }
        public string JsonDesign { get; set; }

        [DefaultValue("true")]
        public bool IsActive { get; set; }

        [Required]
        public int ShapeId { get; set; }
        public Shape Shape { get; set; }

        [DefaultValue("false")]
        public bool isDelete { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public DateTime? DateDelete { get; set; }
        public Sample()
        {
            DateCreated = DateTime.Now;
        }
    }
}
