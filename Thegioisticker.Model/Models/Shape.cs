using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class Shape
    {
        [Key,Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(50)]
        public string Code { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
        public string Image { get; set; }
        [DefaultValue("true")]
        public bool IsActive { get; set; }

        public virtual List<Sample> Samples { get; set; }

        [DefaultValue("false")]
        public bool IsDeleted { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public DateTime? DateDelete { get; set; }
        
        public Shape()
        {
            DateCreated = DateTime.Now;
        }
    }
}
