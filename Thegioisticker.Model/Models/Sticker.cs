using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class Sticker
    {

        [Key, Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int? ProductId { get; set; }
        [Required, MaxLength(250)]
        public string Code { get; set; }
        public string Name { get; set; }
        public float? SquareFrom { get; set; }
        public float? SquareTo { get; set; }
        public float? CurtainPrice { get; set; }
        public float? NoneCurtainPrice { get; set; }
        public float? DefaultPrice { get; set; }
        public float? SpecialPrice { get; set; }
        [DefaultValue("false")]
        public bool isDelete { get; set; }
        public int? CreatedUser { get; set; }
        public int? DeletedUser { get; set; }
        public int? UpdatedUser { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? DeletedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public Sticker()
        {
            CreatedDate = DateTime.Now;
        }
    }
}
