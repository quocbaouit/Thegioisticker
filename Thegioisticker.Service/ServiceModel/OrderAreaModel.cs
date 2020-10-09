using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Thegioisticker.Service
{
    public class TreeModel
    {
        public string Category { get; set; }
        public int CategoryId { get; set; }
        public string Description { get; set; }
        public int Id { get; set; }
        public string Image { get; set; }
        public string LargeImage { get; set; }
        public string Name { get; set; }
        public decimal Price { get; set; }
        public decimal PromotionPrice { get; set; }
        public decimal Quantity { get; set; }
        public decimal QuantityForView { get; set; }
        public decimal Total { get; set; }
    }
    public class OrderAreaModel
    {
        public  List<TreeModel>Tree { get; set; }
        public CustomerModel Customer { get; set; }
        public string Note { get; set; }
        public string PayMentMethol { get; set; }
    }
}
