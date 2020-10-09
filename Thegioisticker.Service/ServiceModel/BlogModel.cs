using Thegioisticker.Model;
using System.Collections.Generic;

namespace Thegioisticker.Service
{
    public class BlogPaging
    {
        public IEnumerable<Blog> Items { get; set; }
        public Pager Pager { get; set; }
    }
}
