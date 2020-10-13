using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface IStickerService
    {
        IEnumerable<Sticker> GetStickers();
        Sticker GetSticker(int id);
        void UpdateSticker(Sticker Sticker);
        void CreateSticker(Sticker Sticker);
        void SaveSticker();
    }

    public class StickerService : IStickerService
    {
        private readonly IStickerRepository _stickerRepository;

        private readonly IUnitOfWork _unitOfWork;

        public StickerService(IStickerRepository stickerRepository, IUnitOfWork unitOfWork)
        {
            this._stickerRepository = stickerRepository;
            this._unitOfWork = unitOfWork;
        }

        #region IStickerService Members

        public IEnumerable<Sticker> GetStickers()
        {
            var Stickers = _stickerRepository.GetMany(x=>!x.isDelete);
            return Stickers;
        }
        public Sticker GetSticker(int id)
        {
            var Sticker = _stickerRepository.GetById(id);
            return Sticker;
        }
        public void UpdateSticker(Sticker Sticker)
        {
            _stickerRepository.Update(Sticker);
            SaveSticker();
        }

        public void CreateSticker(Sticker Sticker)
        {
            _stickerRepository.Add(Sticker);
            SaveSticker();
        }
        public void SaveSticker()
        {
            _unitOfWork.Commit();
        }

        #endregion

    }
}
