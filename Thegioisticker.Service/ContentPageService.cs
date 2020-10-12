using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface IContentPageService
    {
        IEnumerable<ContentPage> GetContentPages();
        ContentPage GetContentPage(int id);
        void CreateContentPage(ContentPage ContentPage);
        void UpdateContentPage(ContentPage ContentPage);
        void SaveContentPage();
        ContentPagePaging GetPagingContentPage(int pageIndex, int pageSize);
        ContentPage GetContentPageBySeoUrl(string seoUrl);
    }

    public class ContentPageService : IContentPageService
    {
        private readonly IContentPageRepository _contentPagesRepository;
        private readonly IUnitOfWork unitOfWork;

        public ContentPageService(IContentPageRepository contentPagesRepository, IUnitOfWork unitOfWork)
        {
            this._contentPagesRepository = contentPagesRepository;
            this.unitOfWork = unitOfWork;
        }
        #region IContentPageService Members

        public IEnumerable<ContentPage> GetContentPages()
        {
            var ContentPages = _contentPagesRepository.GetMany(x=>!x.isDelete);
            return ContentPages;
        }
        public ContentPagePaging GetPagingContentPage(int pageIndex, int pageSize)
        {
            var ContentPages = _contentPagesRepository.GetMany(x=>!x.isDelete);
            var pager = new Pager(ContentPages.Count(), pageIndex,pageSize);
            var ContentPagePaging = new ContentPagePaging
            {
                Items = ContentPages.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize),
                Pager = pager
            };
            return ContentPagePaging;
        }

        public ContentPage GetContentPage(int id)
        {
            var ContentPage = _contentPagesRepository.GetById(id);
            return ContentPage;
        }
        public void UpdateContentPage(ContentPage ContentPage)
        {
            _contentPagesRepository.Update(ContentPage);
            SaveContentPage();
        }

        public void CreateContentPage(ContentPage ContentPage)
        {
            _contentPagesRepository.Add(ContentPage);
            SaveContentPage();
        }
        public ContentPage GetContentPageBySeoUrl(string seoUrl)
        {
            var allData = _contentPagesRepository.GetMany(x => !x.isDelete && x.SeoUrl.Contains(seoUrl)).Select(x => new { x.Id, x.MetaTitle, x.SeoUrl, x.MetaDescription,x.Content }).ToList();
            var content = allData.Select(y => new ContentPage()
            {
                Id = y.Id,
                Description = "",
                MetaTitle = y.MetaTitle,
                Content=y.Content,
                SeoUrl = y.SeoUrl,
                MetaDescription = y.MetaDescription
            }).FirstOrDefault();
            return content;
        }

        public void SaveContentPage()
        {
            unitOfWork.Commit();
        }

        #endregion
    
    }
}
