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
    }

    public class ContentPageService : IContentPageService
    {
        private readonly IContentPageRepository ContentPagesRepository;
        private readonly ICategoryRepository categoryRepository;
        private readonly IUnitOfWork unitOfWork;

        public ContentPageService(IContentPageRepository ContentPagesRepository, ICategoryRepository categoryRepository, IUnitOfWork unitOfWork)
        {
            this.ContentPagesRepository = ContentPagesRepository;
            this.categoryRepository = categoryRepository;
            this.unitOfWork = unitOfWork;
        }

        #region IContentPageService Members

        public IEnumerable<ContentPage> GetContentPages()
        {
            var ContentPages = ContentPagesRepository.GetMany(x=>!x.isDelete);
            return ContentPages;
        }
        public ContentPagePaging GetPagingContentPage(int pageIndex, int pageSize)
        {
            var ContentPages = ContentPagesRepository.GetMany(x=>!x.isDelete);
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
            var ContentPage = ContentPagesRepository.GetById(id);
            return ContentPage;
        }
        public void UpdateContentPage(ContentPage ContentPage)
        {
            ContentPagesRepository.Update(ContentPage);
            SaveContentPage();
        }

        public void CreateContentPage(ContentPage ContentPage)
        {
            ContentPagesRepository.Add(ContentPage);
            SaveContentPage();
        }

        public void SaveContentPage()
        {
            unitOfWork.Commit();
        }

        #endregion
    
    }
}
