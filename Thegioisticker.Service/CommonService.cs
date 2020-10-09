using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface ICommonService
    {
        IEnumerable<Product> GetProducts();
        Product GetProduct(int id);
        void CreateProduct(Product Product);
        void UpdateProduct(Product Product);
        void SaveProduct();
        ProductPaging GetPagingProduct(int pageIndex, int pageSize);
    }

    public class CommonService : ICommonService
    {
        private readonly IProductRepository ProductsRepository;
        private readonly ICategoryRepository categoryRepository;
        private readonly IUnitOfWork unitOfWork;

        public CommonService(IProductRepository ProductsRepository, ICategoryRepository categoryRepository, IUnitOfWork unitOfWork)
        {
            this.ProductsRepository = ProductsRepository;
            this.categoryRepository = categoryRepository;
            this.unitOfWork = unitOfWork;
        }

        #region IProductService Members

        public IEnumerable<Product> GetProducts()
        {
            var Products = ProductsRepository.GetAll();
            return Products;
        }
        public ProductPaging GetPagingProduct(int pageIndex, int pageSize)
        {
            var Products = ProductsRepository.GetMany(x=>!x.isDelete);
            var pager = new Pager(Products.Count(), pageIndex,pageSize);
            var productPaging = new ProductPaging
            {
                Items = Products.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize),
                Pager = pager
            };
            return productPaging;
        }

        public Product GetProduct(int id)
        {
            var Product = ProductsRepository.GetById(id);
            return Product;
        }
        public void UpdateProduct(Product Product)
        {
            ProductsRepository.Update(Product);
            SaveProduct();
        }

        public void CreateProduct(Product Product)
        {
            ProductsRepository.Add(Product);
        }

        public void SaveProduct()
        {
            unitOfWork.Commit();
        }

        #endregion
    
    }
}
