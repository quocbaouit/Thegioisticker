using Thegioisticker.Model;
using System.Collections.Generic;

namespace Thegioisticker.Service
{
    public class CouponPaging
    {
        public IEnumerable<Coupon> Items { get; set; }
        public Pager Pager { get; set; }
    }
}
