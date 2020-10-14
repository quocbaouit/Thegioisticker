using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface IBlogService
    {
        IEnumerable<Blog> GetBlogs();
        Blog GetBlog(int id);
        Blog GetBlogBySeoUrl(string seoUrl);
        void CreateBlog(Blog Blog);
        void UpdateBlog(Blog Blog);
        void SaveBlog();
        BlogPaging GetPagingBlog(int pageIndex, int pageSize);
        IEnumerable<Blog> GetBlogForHomePage();
    }

    public class BlogService : IBlogService
    {
        private readonly IBlogRepository BlogsRepository;
        private readonly ICategoryRepository categoryRepository;
        private readonly IUnitOfWork unitOfWork;

        public BlogService(IBlogRepository BlogsRepository, ICategoryRepository categoryRepository, IUnitOfWork unitOfWork)
        {
            this.BlogsRepository = BlogsRepository;
            this.categoryRepository = categoryRepository;
            this.unitOfWork = unitOfWork;
        }

        #region IBlogService Members

        public IEnumerable<Blog> GetBlogs()
        {
            var datas = BlogsRepository.GetMany(x => !x.isDelete).Select(x => new { x.Id, x.Image, x.Title, x.Author, x.Description,x.SeoUrl,x.MetaTitle,x.MetaDescription }).ToList();
            var Blogs = datas.Select(y => new Blog()
            {
                Id = y.Id,
                Image = y.Image,
                Description = y.Description,
                Title = y.Title,
                Author = y.Author,
                SeoUrl=y.SeoUrl,
                MetaTitle=y.MetaTitle,
                MetaDescription=y.MetaDescription
            }).ToList();
            return Blogs;
        }
        public IEnumerable<Blog> GetBlogForHomePage()
        {

            var datas = BlogsRepository.GetMany(x => !x.isDelete &&x.isInHomePage).Select(x => new { x.Id, x.Image, x.Title, x.Author, x.Description,x.SeoUrl, x.MetaTitle, x.MetaDescription }).ToList();
            var Blogs = datas.Select(y => new Blog()
            {
                Id = y.Id,
                Image = y.Image,
                Description = y.Description,
                Title = y.Title,
                Author = y.Author,
                SeoUrl =y.SeoUrl,
                MetaTitle=y.MetaTitle,
                MetaDescription=y.MetaDescription
            }).ToList();
            return Blogs;
        }
        
        public BlogPaging GetPagingBlog(int pageIndex, int pageSize)
        {
            var allData = BlogsRepository.GetMany(x => !x.isDelete).Select(x => new { x.Id,x.Image,x.Title,x.Author, x.Description,x.SeoUrl }).ToList();
            var Blogs = allData.Select(y => new Blog()
            {
                Id = y.Id,
                Image=y.Image,
                Description=y.Description,
                Title=y.Title,
                Author=y.Author,  
                SeoUrl=y.SeoUrl
            }).ToList();
            var pager = new Pager(Blogs.Count(), pageIndex,pageSize);
            var items = Blogs.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize).ToList();
            var BlogPaging = new BlogPaging
            {
                Items = items,
                Pager = pager
            };
            return BlogPaging;
        }

        public Blog GetBlog(int id)
        {
            var Blog = BlogsRepository.GetById(id);
            return Blog;
        }
        public Blog GetBlogBySeoUrl(string seoUrl)
        {
            var Blog = BlogsRepository.GetMany(x=>!x.isDelete && x.SeoUrl== seoUrl).FirstOrDefault();
            return Blog;
        }
        public void UpdateBlog(Blog Blog)
        {
            BlogsRepository.Update(Blog);
            SaveBlog();
        }

        public void CreateBlog(Blog Blog)
        {
            BlogsRepository.Add(Blog);
            SaveBlog();
        }

        public void SaveBlog()
        {
            unitOfWork.Commit();
        }

        #endregion
    
    }
}
