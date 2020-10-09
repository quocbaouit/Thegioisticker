using Thegioisticker.Model;
using System.Collections.Generic;

namespace Thegioisticker.Service
{
    public class SamplePaging
    {
        public IEnumerable<Sample> Items { get; set; }
        public Pager Pager { get; set; }
    }
}
