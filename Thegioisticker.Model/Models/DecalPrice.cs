using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class DecalPrice
    {

        [Key, Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required, MaxLength(250)]
        public string Description { get; set; }
        public float Quantity { get; set; }
        public float Price { get; set; }
        public float PrintPrice { get; set; }
        public float CutPrice { get; set; }
        public float MachiningPrice { get; set; }
        [DefaultValue("false")]
        public bool isDelete { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public DateTime? DateDelete { get; set; }
        public DecalPrice()
        {
            DateCreated = DateTime.Now;
        }
    }
}
