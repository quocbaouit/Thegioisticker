using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface ISettingService
    {
        IEnumerable<Setting> GetSettings();
        Setting GetSetting(int id);
        void UpdateSetting(Setting faq);
        void CreateSetting(Setting faq);
        void SaveSetting();
    }

    public class SettingService : ISettingService
    {
        private readonly ISettingRepository faqRepository;

        private readonly IUnitOfWork unitOfWork;

        public SettingService(ISettingRepository faqRepository, IUnitOfWork unitOfWork)
        {
            this.faqRepository = faqRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ISettingService Members

        public IEnumerable<Setting> GetSettings()
        {
            var faqs = faqRepository.GetMany(x=>!x.isDelete);
            return faqs;
        }
        public Setting GetSetting(int id)
        {
            var faq = faqRepository.GetById(id);
            return faq;
        }
        public void UpdateSetting(Setting faq)
        {
            faqRepository.Update(faq);
            SaveSetting();
        }

        public void CreateSetting(Setting faq)
        {
            faqRepository.Add(faq);
            SaveSetting();
        }
        public void SaveSetting()
        {
            unitOfWork.Commit();
        }

        #endregion

    }
}
