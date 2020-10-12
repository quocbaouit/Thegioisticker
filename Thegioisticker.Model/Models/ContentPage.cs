using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Thegioisticker.Model
{
    public class ContentPage
    {

        [Key, Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Content { get; set; }

        public string SeoUrl { get; set; }
        public string MetaTitle { get; set; }
        public string MetaDescription { get; set; }

        [DefaultValue("false")]
        public bool isDelete { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }
        public DateTime? DateDelete { get; set; }
        public ContentPage()
        {
            DateCreated = DateTime.Now;
        }
    }
}
