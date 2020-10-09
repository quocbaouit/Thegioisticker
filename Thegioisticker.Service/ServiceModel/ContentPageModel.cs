using Thegioisticker.Model;
using System.Collections.Generic;

namespace Thegioisticker.Service
{
    public class ContentPagePaging
    {
        public IEnumerable<ContentPage> Items { get; set; }
        public Pager Pager { get; set; }
    }
}
