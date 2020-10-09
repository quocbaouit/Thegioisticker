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
    /// <summary>
    /// Get all settings
    /// </summary>
    [RoutePrefix("api/setting")]
    public class SettingController : ApiController
    {
        private readonly ISettingService settingService;

        public SettingController(ISettingService settingService)
        {
            this.settingService = settingService;
        }
        [HttpGet]
        [Route("getSettings")]
        public IHttpActionResult GetSettings()
        {
            var settings = settingService.GetSettings();
            if (settings != null)
                return Ok(settings);
            return NotFound();
        }
        [HttpGet]
        [Route("getPagingSettings")]
        public DataTableResponse GetSettings(DataTableRequest request)
        {
            // Query settings
            var settings = settingService.GetSettings();

            // Searching Data
            IEnumerable<Setting> filteredsettings;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredsettings = settings.Where(p => p.Name.Contains(searchText));
            }
            else
            {
                filteredsettings = settings;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Setting, string> orderingFunctionString = null;
                Func<Setting, int> orderingFunctionInt = null;

                switch (sortColumnIndex)
                {
                    case 0:     // settingID
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredsettings =
                                sortDirection == "asc"
                                    ? filteredsettings.OrderBy(orderingFunctionInt)
                                    : filteredsettings.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:     // settingName
                        {
                            orderingFunctionString = (c => c.Name);
                            filteredsettings =
                                sortDirection == "asc"
                                    ? filteredsettings.OrderBy(orderingFunctionString)
                                    : filteredsettings.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:     // Answer
                        {
                            orderingFunctionString = (c => c.SettingValue);
                            filteredsettings =
                                sortDirection == "asc"
                                    ? filteredsettings.OrderBy(orderingFunctionString)
                                    : filteredsettings.OrderByDescending(orderingFunctionString);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedsettings = filteredsettings.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = settings.Count(),
                recordsFiltered = settings.Count(),
                data = pagedsettings.ToArray(),
                error = ""
            };
        }

        [Route("GetSettingById/{id}")]
        public IHttpActionResult GetSettingById(int Id)
        {
            var setting = settingService.GetSetting(Id);
            if (setting != null)
            {
                return Ok(setting);
            }
            return NotFound();

        }
        
        [HttpPost]
        [Route("deleteSetting")]
        public IHttpActionResult DeleteSetting(Setting settingModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (settingModel.Id != 0)
                {
                    settingModel.isDelete = true;
                    settingService.UpdateSetting(settingModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("saveSetting")]
        public IHttpActionResult saveSetting(Setting settingModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (settingModel.Id != 0)
                {
                    settingService.UpdateSetting(settingModel);
                }
                else
                {
                    settingService.CreateSetting(settingModel);
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