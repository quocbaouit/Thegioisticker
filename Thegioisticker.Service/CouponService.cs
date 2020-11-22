using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface ICouponService
    {
        IEnumerable<Coupon> GetCoupons();
        Coupon GetCoupon(int id);
        void CreateCoupon(Coupon Coupon);
        void UpdateCoupon(Coupon Coupon);
        void SaveCoupon();
        CouponPaging GetPagingCoupon(int pageIndex, int pageSize);
        Coupon CheckCoupon(string coupoun);
    }

    public class CouponService : ICouponService
    {
        private readonly ICouponRepository CouponsRepository;
        private readonly IPageRepository PageRepository;
        private readonly IUnitOfWork unitOfWork;

        public CouponService(ICouponRepository CouponsRepository, IPageRepository PageRepository, IUnitOfWork unitOfWork)
        {
            this.CouponsRepository = CouponsRepository;
            this.PageRepository = PageRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ICouponService Members

        public IEnumerable<Coupon> GetCoupons()
        {
            var Coupons = CouponsRepository.GetMany(x=>!x.isDelete);
            return Coupons;
        }
        public CouponPaging GetPagingCoupon(int pageIndex, int pageSize)
        {
            var Coupons = CouponsRepository.GetMany(x=>!x.isDelete);
            var pager = new Pager(Coupons.Count(), pageIndex,pageSize);
            var CouponPaging = new CouponPaging
            {
                Items = Coupons.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize),
                Pager = pager
            };
            return CouponPaging;
        }

        public Coupon GetCoupon(int id)
        {
            var Coupon = CouponsRepository.GetById(id);
            return Coupon;
        }
        public Coupon CheckCoupon(string coupoun)
        {
            var Coupon = CouponsRepository.GetMany(x=>x.Code.ToLower()==coupoun.ToLower() && (x.LimitUsed>x.Used||x.LimitUsed==0)).FirstOrDefault();
            return Coupon;
        }
        public void UpdateCoupon(Coupon Coupon)
        {
            CouponsRepository.Update(Coupon);
            SaveCoupon();
        }

        public void CreateCoupon(Coupon Coupon)
        {
            CouponsRepository.Add(Coupon);
            SaveCoupon();
        }

        public void SaveCoupon()
        {
            unitOfWork.Commit();
        }

        #endregion
    
    }
}
