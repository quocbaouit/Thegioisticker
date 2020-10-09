using Thegioisticker.Model;
using System.Collections.Generic;

namespace Thegioisticker.Service
{
    public class ProductPaging
    {
        public IEnumerable<Product> Items { get; set; }
        public Pager Pager { get; set; }
    }
}
