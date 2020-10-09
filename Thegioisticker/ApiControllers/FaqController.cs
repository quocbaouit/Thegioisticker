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
    /// Get all faqs
    /// </summary>
    [RoutePrefix("api/faq")]
    public class FaqController : ApiController
    {
        private readonly IFaqService faqService;

        public FaqController(IFaqService faqService)
        {
            this.faqService = faqService;
        }
        [HttpGet]
        [Route("getFaqs")]
        public IHttpActionResult GetFaqs()
        {
            var faqs = faqService.GetFaqs();
            if (faqs != null)
                return Ok(faqs);
            return NotFound();
        }
        [HttpGet]
        [Route("getPagingFaqs")]
        public DataTableResponse GetFaqs(DataTableRequest request)
        {
            // Query faqs
            var faqs = faqService.GetFaqs();

            // Searching Data
            IEnumerable<Faq> filteredfaqs;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredfaqs = faqs.Where(p => p.Question.Contains(searchText));
            }
            else
            {
                filteredfaqs = faqs;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Faq, string> orderingFunctionString = null;
                Func<Faq, int> orderingFunctionInt = null;

                switch (sortColumnIndex)
                {
                    case 0:     // faqID
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredfaqs =
                                sortDirection == "asc"
                                    ? filteredfaqs.OrderBy(orderingFunctionInt)
                                    : filteredfaqs.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:     // faqName
                        {
                            orderingFunctionString = (c => c.Question);
                            filteredfaqs =
                                sortDirection == "asc"
                                    ? filteredfaqs.OrderBy(orderingFunctionString)
                                    : filteredfaqs.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 2:     // Answer
                        {
                            orderingFunctionString = (c => c.Answer);
                            filteredfaqs =
                                sortDirection == "asc"
                                    ? filteredfaqs.OrderBy(orderingFunctionString)
                                    : filteredfaqs.OrderByDescending(orderingFunctionString);
                            break;
                        }
                }
            }

            // Paging Data
            var pagedfaqs = filteredfaqs.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = faqs.Count(),
                recordsFiltered = faqs.Count(),
                data = pagedfaqs.ToArray(),
                error = ""
            };
        }

        [Route("GetFaqById/{id}")]
        public IHttpActionResult GetFaqById(int Id)
        {
            var faq = faqService.GetFaq(Id);
            if (faq != null)
            {
                return Ok(faq);
            }
            return NotFound();

        }
        
        [HttpPost]
        [Route("deleteFaq")]
        public IHttpActionResult DeleteFaq(Faq faqModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (faqModel.Id != 0)
                {
                    faqModel.isDelete = true;
                    faqService.UpdateFaq(faqModel);
                }

                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("saveFaq")]
        public IHttpActionResult saveFaq(Faq faqModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (faqModel.Id != 0)
                {
                    faqService.UpdateFaq(faqModel);
                }
                else
                {
                    faqService.CreateFaq(faqModel);
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