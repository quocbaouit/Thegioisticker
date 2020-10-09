using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface IFaqService
    {
        IEnumerable<Faq> GetFaqs();
        Faq GetFaq(int id);
        void UpdateFaq(Faq faq);
        void CreateFaq(Faq faq);
        void SaveFaq();
    }

    public class FaqService : IFaqService
    {
        private readonly IFaqRepository faqRepository;

        private readonly IUnitOfWork unitOfWork;

        public FaqService(IFaqRepository faqRepository, IUnitOfWork unitOfWork)
        {
            this.faqRepository = faqRepository;
            this.unitOfWork = unitOfWork;
        }

        #region IFaqService Members

        public IEnumerable<Faq> GetFaqs()
        {
            var faqs = faqRepository.GetMany(x=>!x.isDelete);
            return faqs;
        }
        public Faq GetFaq(int id)
        {
            var faq = faqRepository.GetById(id);
            return faq;
        }
        public void UpdateFaq(Faq faq)
        {
            faqRepository.Update(faq);
            SaveFaq();
        }

        public void CreateFaq(Faq faq)
        {
            faqRepository.Add(faq);
            SaveFaq();
        }
        public void SaveFaq()
        {
            unitOfWork.Commit();
        }

        #endregion

    }
}
