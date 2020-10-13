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
    /// Get all Stickers
    /// </summary>
    [RoutePrefix("api/Sticker")]
    public class StickerController : ApiController
    {
        private readonly IStickerService StickerService;

        public StickerController(IStickerService StickerService)
        {
            this.StickerService = StickerService;
        }
        [HttpGet]
        [Route("getStickers")]
        public IHttpActionResult GetStickers()
        {
            var Stickers = StickerService.GetStickers();
            if (Stickers != null)
                return Ok(Stickers);
            return NotFound();
        }
        [HttpGet]
        [Route("getPagingStickers")]
        public DataTableResponse GetStickers(DataTableRequest request)
        {
            // Query Stickers
            var Stickers = StickerService.GetStickers();

            // Searching Data
            IEnumerable<Sticker> filteredStickers;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredStickers = Stickers.Where(p => p.Code.Contains(searchText));
            }
            else
            {
                filteredStickers = Stickers;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Sticker, string> orderingFunctionString = null;
                Func<Sticker, int> orderingFunctionInt = null;

            }

            // Paging Data
            var pagedSticker = filteredStickers.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = Stickers.Count(),
                recordsFiltered = Stickers.Count(),
                data = pagedSticker.ToArray(),
                error = ""
            };
        }

        [Route("getStickerById/{id}")]
        public IHttpActionResult GetStickerById(int Id)
        {
            var Sticker = StickerService.GetSticker(Id);
            if (Sticker != null)
            {
                return Ok(Sticker);
            }
            return NotFound();

        }

        [HttpPost]
        [Route("deleteSticker")]
        public IHttpActionResult DeleteSticker(Sticker StickerModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (StickerModel.Id != 0)
                {
                    StickerModel.isDelete = true;
                    StickerService.UpdateSticker(StickerModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("saveSticker")]
        public IHttpActionResult saveSticker(Sticker StickerModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (StickerModel.Id != 0)
                {
                    StickerService.UpdateSticker(StickerModel);
                }
                else
                {
                    StickerService.CreateSticker(StickerModel);
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