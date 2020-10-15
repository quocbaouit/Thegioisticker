using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface IProductService
    {
        IEnumerable<Product> GetProducts();
        Product GetProduct(int id);
        Product GetProduct(string code);
        void CreateProduct(Product Product);
        void UpdateProduct(Product Product);
        List<CategoryModel> GetProductCategory();
        void Save();
        ProductPaging GetPagingProduct(int pageIndex, int pageSize,int categoryId);
        IEnumerable<ProductSample> GetProductSampleByProductId(int productId);
        void CreateProductSample(List<ProductSample> Product);
        List<int> GetSampleIdByProductId(int productId); 
         List<Sample> GetSampleByProductBySeoUrl(string seoUrl);
        List<Sample> GetSampleByProductById(int id);
        Product GetProductBySeoUrl(string seoUrl);
        string GetProductDescriptionSeoUrl(string seoUrl);
        void UpdateProductDescription(int id,string productDescription);
    }

    public class ProductService : IProductService
    {
        private readonly IProductRepository _productsRepository;
        private readonly IProductCategoryRepository _productCategoryRepository;
        private readonly IProductSampleRepository _productSampleRepository;
        private readonly ISampleRepository _sampleRepository;
        private readonly IUnitOfWork unitOfWork;

        public ProductService(IProductRepository ProductsRepository, IProductCategoryRepository productCategoryRepository, IUnitOfWork unitOfWork, IProductSampleRepository productSampleRepository, ISampleRepository sampleRepository)
        {
            this._productsRepository = ProductsRepository;
            this._productCategoryRepository = productCategoryRepository;
            this._productSampleRepository = productSampleRepository;
            this._sampleRepository = sampleRepository;
            this.unitOfWork = unitOfWork;
        }

        #region IProductService Members

        public IEnumerable<Product> GetProducts()
        {
          var allData=  _productsRepository.GetMany(x => !x.isDelete).Select(x => new { x.Id,x.Code,x.regularProducts, x.Image, x.MetaTitle, x.Name,x.Price,x.ProductCategoryId,x.IsActive,x.SeoUrl,x.MetaDescription }).ToList();
            var Products = allData.Select(y => new Product()
            {
                Id = y.Id,
                Code = y.Code,
                Name = y.Name,
                Image = y.Image,
                Description = "",
                MetaTitle = y.MetaTitle,
                Price = y.Price,
                IsActive=y.IsActive,
                ProductCategoryId=y.ProductCategoryId,
                SeoUrl=y.SeoUrl,
                MetaDescription=y.MetaDescription
            }).ToList();
            //var Products = _productsRepository.GetMany(x=>!x.isDelete);
            return Products;
        }
        public IEnumerable<ProductSample> GetProductSampleByProductId(int productId)
        {
            var productSample =_productsRepository.GetById(productId).ProductSample;
            return productSample;
        }
        private int CountProduct()
        {
            var result = _productsRepository.GetMany(x => !x.isDelete).Count();
            return result;
        }

        public List<CategoryModel> GetProductCategory()
        {
            var listCategory =  _productCategoryRepository.GetAll().Select(
                x => new CategoryModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Image=x.Image,
                    Url=x.Url,
                    numberProduct = x.Products.Count()
                }).ToList();
            return listCategory;
        }
        public ProductPaging GetPagingProduct(int pageIndex, int pageSize, int categoryId)
        {
            var Products = _productsRepository.GetMany(x=>!x.isDelete);
            if (categoryId != 0)
            {
                Products = Products.Where(x => x.ProductCategoryId == categoryId);
            }
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
            var Product = _productsRepository.GetById(id);
            var listSampleId = _productSampleRepository.GetMany(x => x.ProductId == id).ToList().Select(x=>x.SampleId);
            //Product.ProductSample = _sampleRepository.GetMany(x => listSampleId.Contains(x.Id)).ToList();
            return Product;
        }
        public List<Sample> GetSampleByProductById(int id)
        {
            var listSampleId = _productSampleRepository.GetMany(x => x.ProductId == id).ToList().Select(x => x.SampleId);
          var result = _sampleRepository.GetMany(x => listSampleId.Contains(x.Id)).ToList();
            return result;
        }
        public void UpdateProduct(Product product)
        {
            var productUd = _productsRepository.GetById(product.Id);
            productUd.Name = product.Name;
            productUd.Price = product.Price;
            productUd.IsActive = product.IsActive;
            productUd.SeoUrl = product.SeoUrl;
            productUd.MetaTitle = product.MetaTitle;
            productUd.MetaDescription = product.MetaDescription;
            productUd.Image = product.Image;
            _productsRepository.Update(productUd);
            Save();
        }

        public void CreateProduct(Product Product)
        {
            Product.regularProducts = true;
            _productsRepository.Add(Product);
            Save();
        }
        public void CreateProductSample(List<ProductSample> Product)
        {
            var deleteId = Product[0].ProductId;
            _productSampleRepository.Delete(x=>x.ProductId== deleteId);
            foreach (var poductSampe in Product)
            {
                _productSampleRepository.Add(poductSampe);
            }    
            Save();
        }

        public void Save()
        {
            unitOfWork.Commit();
        }

        public Product GetProduct(string code)
        {
            var Product = _productsRepository.GetMany(x=>!x.isDelete && x.Code==code).FirstOrDefault();
            return Product;
        }
        public List<int> GetSampleIdByProductId(int productId)
        {
            var productSample = _productsRepository.GetById(productId).ProductSample;
            return productSample.Select(x => x.SampleId).ToList();
        }
        public Product GetProductBySeoUrl(string seoUrl)
        {
            var allData = _productsRepository.GetMany(x => !x.isDelete && x.SeoUrl == seoUrl).Select(x => new { x.Id,x.Description, x.Code, x.regularProducts, x.Image, x.MetaTitle, x.Name, x.Price, x.ProductCategoryId, x.IsActive, x.SeoUrl, x.MetaDescription }).ToList();
            var Product = allData.Select(y => new Product()
            {
                Id = y.Id,
                Code = y.Code,
                Name = y.Name,
                Image = y.Image,
                Description = y.Description,
                MetaTitle = y.MetaTitle,
                Price = y.Price,
                IsActive = y.IsActive,
                ProductCategoryId = y.ProductCategoryId,
                SeoUrl = y.SeoUrl,
                MetaDescription = y.MetaDescription
            }).FirstOrDefault();
            return Product;
        }

        public string GetProductDescriptionSeoUrl(string seoUrl)
        {
            var product = _productsRepository.GetMany(x => !x.isDelete && x.SeoUrl == seoUrl).FirstOrDefault().Description;
            return product;
        }

        public List<Sample> GetSampleByProductBySeoUrl(string seoUrl)
        {
            var prodId = _productsRepository.GetMany(x => x.SeoUrl == seoUrl).FirstOrDefault().Id;
            var listSampleId = _productSampleRepository.GetMany(x => x.ProductId == prodId).ToList().Select(x => x.SampleId);
            var result = _sampleRepository.GetMany(x => listSampleId.Contains(x.Id)).ToList();
            return result;
        }

        public void UpdateProductDescription(int id, string productDescription)
        {
            var product = _productsRepository.GetById(id);
            product.Description = productDescription;
            _productsRepository.Update(product);
            Save();
        }

        #endregion

    }
}
