using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    public interface IPageService
    {
        IEnumerable<Page> GetCategories(string name = null);
        Page GetPage(int id);
        Page GetPage(string name);
        void CreatePage(Page Page);
        void SavePage();
    }

    public class PageService : IPageService
    {
        private readonly IPageRepository PagesRepository;
        private readonly IUnitOfWork unitOfWork;

        public PageService(IPageRepository PagesRepository, IUnitOfWork unitOfWork)
        {
            this.PagesRepository = PagesRepository;
            this.unitOfWork = unitOfWork;
        }

        #region IPageService Members

        public IEnumerable<Page> GetCategories(string name = null)
        {
            if (string.IsNullOrEmpty(name))
                return PagesRepository.GetAll();
            else
                return PagesRepository.GetAll().Where(c => c.Name == name);
        }

        public Page GetPage(int id)
        {
            var Page = PagesRepository.GetById(id);
            return Page;
        }

        public Page GetPage(string name)
        {
            var Page = PagesRepository.GetPageByName(name);
            return Page;
        }

        public void CreatePage(Page Page)
        {
            PagesRepository.Add(Page);
        }

        public void SavePage()
        {
            unitOfWork.Commit();
        }

        #endregion
    }
}
