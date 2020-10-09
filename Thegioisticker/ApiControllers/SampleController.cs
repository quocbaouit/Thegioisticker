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
    /// Get all Samples
    /// </summary>
    [RoutePrefix("api/samples")]
    public class SampleController : ApiController
    {
        private readonly ISampleService sampleService;
        private readonly IProductService productService;
        private readonly IShapeService shapeService;

        public SampleController(ISampleService sampleService, IProductService productService, IShapeService shapeService)
        {
            this.sampleService = sampleService;
            this.productService = productService;
            this.shapeService = shapeService;
        }
        [HttpGet]
        [Route("getSamples")]
        public IHttpActionResult GetSamples(int pageIndex, int pageSize,int category)
        {
            var sample = sampleService.GetPagingSample(pageIndex, pageSize, category);
            if (sample != null)
                return Ok(sample);
            return NotFound();
        }
        [HttpGet]
        [Route("getSamplesByShape/{shape}")]
        public IHttpActionResult GetSamplesByShape(int shape)
        {
            var  samples = sampleService.GetSamplesByShape(shape);
            if (samples != null)
                return Ok(samples);
            return NotFound();
        }
        [HttpGet]
        [Route("getPagingSamples/{sort}")]
        public DataTableResponse GetSamples(DataTableRequest request,int sort)
        {
            // Query samples
            var samples = sampleService.GetSamples();

            // Searching Data
            IEnumerable<Sample> filteredSamples;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredSamples = samples.Where(p => p.Name.Contains(searchText));
            }
            else
            {
                filteredSamples = samples;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Sample, string> orderingFunctionString = null;
                Func<Sample, int> orderingFunctionInt = null;

                switch (sortColumnIndex)
                {
                    case 0:     // SampleID
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredSamples =
                                sortDirection == "asc"
                                    ? filteredSamples.OrderByDescending(orderingFunctionInt)
                                    : filteredSamples.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:     // SampleName
                        {
                            orderingFunctionString = (c => c.Name);
                            filteredSamples =
                                sortDirection == "asc"
                                    ? filteredSamples.OrderBy(orderingFunctionString)
                                    : filteredSamples.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 6:     // UnitPrice
                        {
                            break;
                        }
                }
            }

            // Paging Data
            var pagedSamples = filteredSamples.Skip(request.Start).Take(request.Length);
            var returnData = pagedSamples.ToArray();
            foreach (var item in returnData)
            {
                item.Shape = shapeService.GetShape(item.ShapeId);
            }
            List<int> listSort = new List<int>();
            if (sort!=0)
            {
                listSort = productService.GetSampleIdByProductId(sort);
                returnData = returnData.OrderByDescending(d => listSort.IndexOf(d.Id)).ToArray();
            }
           
            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = samples.Count(),
                recordsFiltered = samples.Count(),
                data = returnData,
                error = ""
            };
        }

        [Route("GetSampleById/{id}")]
        public IHttpActionResult GetSampleById(int Id)
        {
            var sample = sampleService.GetSample(Id);
            if (sample != null)
            {
                return Ok(sample);
            }
            return NotFound();

        }
        [Route("GetSampleByCode/{code}")]
        public IHttpActionResult GetSampleByCode(string code)
        {
            var sample = sampleService.GetSample(code);
            if (sample != null)
            {
                return Ok(sample);
            }
            return NotFound();

        }

        [Route("getShape")]
        public IHttpActionResult GetSampleCategory()
        {
            var shape = sampleService.GetShape();
            if (shape != null)
            {
                return Ok(shape);
            }
            return NotFound();

        }

        [HttpPost]
        [Route("CreateSample")]
        public IHttpActionResult CreateSample(Sample sampleModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (sampleModel.Id != 0) {
                    sampleService.UpdateSample(sampleModel);
                }
                else {
                    sampleService.CreateSample(sampleModel);
                }
              
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("getAllSample")]
        public IHttpActionResult GetAllSample()
        {
            var sample = sampleService.GetSamples();
            if (sample != null)
            {
                return Ok(sample);
            }
            return NotFound();

        }
    }
}