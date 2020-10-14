using Thegioisticker.API.Models;
using Thegioisticker.Model;
using Thegioisticker.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Thegioisticker.API.Controllers
{
    /// <summary>
    /// Get all decalPrices
    /// </summary>
    [RoutePrefix("api/decalPrice")]
    public class DecalPriceController : ApiController
    {
        private readonly IDecalPriceService decalPriceService;
        private readonly IStickerService _stickerService;

        public DecalPriceController(IDecalPriceService decalPriceService, IStickerService stickerService)
        {
            this.decalPriceService = decalPriceService;
            this._stickerService = stickerService;
        }
        [HttpGet]
        [Route("getDecalPrices")]
        public IHttpActionResult GetDecalPrices()
        {
            var decalPrices = decalPriceService.GetDecalPrices();
            if (decalPrices != null)
                return Ok(decalPrices);
            return NotFound();
        }
        [HttpGet]
        [Route("getAllSticker")]
        public IHttpActionResult GetAllSticker()
        {
            var sticker = _stickerService.GetStickers();
            if (sticker != null)
                return Ok(sticker);
            return NotFound();
        }
        [HttpGet]
        [Route("getPagingDecalPrices")]
        public DataTableResponse GetDecalPrices(DataTableRequest request)
        {
            // Query decalPrices
            var decalPrices = decalPriceService.GetDecalPrices();

            // Searching Data
            IEnumerable<DecalPrice> filtereddecalPrices;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filtereddecalPrices = decalPrices.Where(p => p.Description.Contains(searchText));
            }
            else
            {
                filtereddecalPrices = decalPrices;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<DecalPrice, string> orderingFunctionString = null;
                Func<DecalPrice, int> orderingFunctionInt = null;

            }

            // Paging Data
            var pagedDecalPrice = filtereddecalPrices.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = decalPrices.Count(),
                recordsFiltered = decalPrices.Count(),
                data = pagedDecalPrice.ToArray(),
                error = ""
            };
        }

        [Route("GetDecalPriceById/{id}")]
        public IHttpActionResult GetDecalPriceById(int Id)
        {
            var decalPrice = decalPriceService.GetDecalPrice(Id);
            if (decalPrice != null)
            {
                return Ok(decalPrice);
            }
            return NotFound();

        }

        [HttpPost]
        [Route("deleteDecalPrice")]
        public IHttpActionResult DeleteDecalPrice(DecalPrice decalPriceModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (decalPriceModel.Id != 0)
                {
                    decalPriceModel.isDelete = true;
                    decalPriceService.UpdateDecalPrice(decalPriceModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("saveDecalPrice")]
        public IHttpActionResult saveDecalPrice(DecalPrice decalPriceModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (decalPriceModel.Id != 0)
                {
                    decalPriceService.UpdateDecalPrice(decalPriceModel);
                }
                else
                {
                    decalPriceService.CreateDecalPrice(decalPriceModel);
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