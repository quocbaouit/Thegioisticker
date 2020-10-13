using System;
using System.Collections.Generic;

namespace Thegioisticker.Model
{
    public class Category
    {
        public int CategoryID { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateUpdated { get; set; }

        public string Test { get; set; }

        public Category()
        {
            DateCreated = DateTime.Now;
        }
    }
}
