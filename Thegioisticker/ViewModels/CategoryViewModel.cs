using System.Collections.Generic;

namespace Thegioisticker.API.ViewModels
{
    public class CategoryViewModel
    {
        public int CategoryID { get; set; }
        public string Name { get; set; }

        public List<DeleteCustomerModel> Gadgets { get; set; }
    }
}