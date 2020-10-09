using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface IDecalPriceService
    {
        IEnumerable<DecalPrice> GetDecalPrices();
        DecalPrice GetDecalPrice(int id);
        void UpdateDecalPrice(DecalPrice DecalPrice);
        void CreateDecalPrice(DecalPrice DecalPrice);
        void SaveDecalPrice();
    }

    public class DecalPriceService : IDecalPriceService
    {
        private readonly IDecalPriceRepository DecalPriceRepository;

        private readonly IUnitOfWork unitOfWork;

        public DecalPriceService(IDecalPriceRepository DecalPriceRepository, IUnitOfWork unitOfWork)
        {
            this.DecalPriceRepository = DecalPriceRepository;
            this.unitOfWork = unitOfWork;
        }

        #region IDecalPriceService Members

        public IEnumerable<DecalPrice> GetDecalPrices()
        {
            var decalPrices = DecalPriceRepository.GetMany(x=>!x.isDelete);
            return decalPrices;
        }
        public DecalPrice GetDecalPrice(int id)
        {
            var decalPrice = DecalPriceRepository.GetById(id);
            return decalPrice;
        }
        public void UpdateDecalPrice(DecalPrice decalPrice)
        {
            DecalPriceRepository.Update(decalPrice);
            SaveDecalPrice();
        }

        public void CreateDecalPrice(DecalPrice decalPrice)
        {
            DecalPriceRepository.Add(decalPrice);
            SaveDecalPrice();
        }
        public void SaveDecalPrice()
        {
            unitOfWork.Commit();
        }

        #endregion

    }
}
