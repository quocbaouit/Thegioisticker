using Thegioisticker.API.Models;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using Thegioisticker.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace Thegioisticker.API.Controllers
{
    public class CheckCounpon
    {
        public string Name { get; set; }
    }
    /// <summary>
    /// Get all Products
    /// </summary>
    [RoutePrefix("api/coupon")]
    public class CouponController : ApiController
    {
        private readonly ICouponService couponService;

        public CouponController(ICouponService couponService)
        {
            this.couponService = couponService;
        }
        //[HttpGet]
        //[Route("getCoupons")]
        //public IHttpActionResult GetCoupons(int pageIndex, int pageSize)
        //{
        //    var coupons = couponService.GetPagingCoupon(pageIndex, pageSize);
        //    if (coupons != null)
        //        return Ok(coupons);
        //    return NotFound();
        //}
        [HttpGet]
        [Route("getCoupons")]
        public IHttpActionResult GetCoupons()
        {
            var coupons = couponService.GetCoupons();
            if (coupons != null)
                return Ok(coupons);
            return NotFound();
        }
        
       [HttpGet]
        [Route("getPagingCoupons")]
        public DataTableResponse GetCoupons(DataTableRequest request)
        {
            // Query coupons
            var coupons = couponService.GetCoupons();

            // Searching Data
            IEnumerable<Coupon> filteredcoupons;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredcoupons = coupons.Where(p => p.Name.Contains(searchText));
            }
            else
            {
                filteredcoupons = coupons;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Coupon, string> orderingFunctionString = null;
                Func<Coupon, int> orderingFunctionInt = null;
                Func<Coupon, bool> orderingFunctionBool = null;

                switch (sortColumnIndex)
                {
                    case 0:
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredcoupons =
                                sortDirection == "asc"
                                    ? filteredcoupons.OrderByDescending(orderingFunctionInt)
                                    : filteredcoupons.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:
                        {
                            orderingFunctionString = (c => c.Name);
                            filteredcoupons =
                                sortDirection == "asc"
                                    ? filteredcoupons.OrderBy(orderingFunctionString)
                                    : filteredcoupons.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:
                        {
                            orderingFunctionString = (c => c.Name);
                            filteredcoupons =
                                sortDirection == "asc"
                                    ? filteredcoupons.OrderBy(orderingFunctionString)
                                    : filteredcoupons.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 5:
                        {
                            orderingFunctionBool = (c => c.isDelete);
                            filteredcoupons =
                                sortDirection == "asc"
                                    ? filteredcoupons.OrderBy(orderingFunctionBool)
                                    : filteredcoupons.OrderByDescending(orderingFunctionBool);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedcoupons = filteredcoupons.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = coupons.Count(),
                recordsFiltered = coupons.Count(),
                data = pagedcoupons.ToArray(),
                error = ""
            };
        }
        [HttpGet]
        [Route("getPagingCouponsForHomePage")]
        public DataTableResponse GetPagingCouponsForHomePage(DataTableRequest request)
        {
            // Query coupons
            var coupons = couponService.GetCoupons().Where(x=>x.isDelete);

            // Searching Data
            IEnumerable<Coupon> filteredcoupons;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredcoupons = coupons.Where(p => p.Code.Contains(searchText));
            }
            else
            {
                filteredcoupons = coupons;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Coupon, string> orderingFunctionString = null;
                Func<Coupon, int> orderingFunctionInt = null;
                Func<Coupon, bool> orderingFunctionBool = null;

                switch (sortColumnIndex)
                {
                    case 0:
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredcoupons =
                                sortDirection == "asc"
                                    ? filteredcoupons.OrderBy(orderingFunctionInt)
                                    : filteredcoupons.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:
                        {
                            orderingFunctionString = (c => c.Name);
                            filteredcoupons =
                                sortDirection == "asc"
                                    ? filteredcoupons.OrderBy(orderingFunctionString)
                                    : filteredcoupons.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:
                        {
                            orderingFunctionString = (c => c.Name);
                            filteredcoupons =
                                sortDirection == "asc"
                                    ? filteredcoupons.OrderBy(orderingFunctionString)
                                    : filteredcoupons.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 5:
                        {
                            orderingFunctionBool = (c => c.isDelete);
                            filteredcoupons =
                                sortDirection == "asc"
                                    ? filteredcoupons.OrderBy(orderingFunctionBool)
                                    : filteredcoupons.OrderByDescending(orderingFunctionBool);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedcoupons = filteredcoupons.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = coupons.Count(),
                recordsFiltered = coupons.Count(),
                data = pagedcoupons.ToArray(),
                error = ""
            };
        }
        [Route("getCouponForHomePage")]
        public IHttpActionResult GetCouponForHomePage()
        {
            var coupon = couponService.GetCoupons().Where(x => x.isDelete);
            if (coupon != null)
            {
                return Ok(coupon);
            }
            return NotFound();

        }
        [Route("GetCouponById/{id}")]
        public IHttpActionResult GetCouponById(int Id)
        {
            var coupon = couponService.GetCoupon(Id);
            if (coupon != null)
            {
                return Ok(coupon);
            }
            return NotFound();

        }
        [HttpPost]
        [Route("checkCoupon")]
        public IHttpActionResult checkCoupon(CheckCounpon coupon)
        {
            if (string.IsNullOrEmpty(coupon.Name))
            {
                return NotFound();
            }
            var result = couponService.CheckCoupon(coupon.Name);        
            if (result != null)
            {
                return Ok(result);
            }
            return NotFound();
        }

        [HttpPost]
        [Route("deleteCoupon")]
        public IHttpActionResult DeleteCoupon(Coupon couponModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (couponModel.Id != 0)
                {
                    couponModel.isDelete = true;
                    couponService.UpdateCoupon(couponModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("saveCoupon")]
        public IHttpActionResult saveCoupon(Coupon couponModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (couponModel.Id != 0)
                {
                    couponService.UpdateCoupon(couponModel);
                }
                else
                {
                    couponService.CreateCoupon(couponModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }
    }
}