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
    /// Get all Shapes
    /// </summary>
    [RoutePrefix("api/shapes")]
    public class ShapeController : ApiController
    {
        private readonly IShapeService shapeService;

        public ShapeController(IShapeService shapeService)
        {
            this.shapeService = shapeService;
        }
        [HttpGet]
        [Route("getPagingShapes")]
        public DataTableResponse GetShapes(DataTableRequest request)
        {
            // Query shapes
            var shapes = shapeService.GetShapes();

            // Searching Data
            IEnumerable<Shape> filteredShapes;
            if (request.Search.Value != "")
            {
                var searchText = request.Search.Value.Trim();

                filteredShapes = shapes.Where(p => p.Name.Contains(searchText));
            }
            else
            {
                filteredShapes = shapes;
            }

            // Sort Data
            if (request.Order.Any())
            {
                int sortColumnIndex = request.Order[0].Column;
                string sortDirection = request.Order[0].Dir;

                Func<Shape, string> orderingFunctionString = null;
                Func<Shape, int> orderingFunctionInt = null;

                switch (sortColumnIndex)
                {
                    case 0:     // ShapeID
                        {
                            orderingFunctionInt = (c => c.Id);
                            filteredShapes =
                                sortDirection == "asc"
                                    ? filteredShapes.OrderBy(orderingFunctionInt)
                                    : filteredShapes.OrderByDescending(orderingFunctionInt);
                            break;
                        }
                    case 1:     // ShapeName
                        {
                            orderingFunctionString = (c => c.Name);
                            filteredShapes =
                                sortDirection == "asc"
                                    ? filteredShapes.OrderBy(orderingFunctionString)
                                    : filteredShapes.OrderByDescending(orderingFunctionString);
                            break;
                        }
                    case 6:     // UnitPrice
                        {
                            break;
                        }
                }
            }

            // Paging Data
            var pagedShapes = filteredShapes.Skip(request.Start).Take(request.Length);

            return new DataTableResponse
            {
                draw = request.Draw,
                recordsTotal = shapes.Count(),
                recordsFiltered = shapes.Count(),
                data = pagedShapes.ToArray(),
                error = ""
            };
        }

        [Route("GetShapeById/{id}")]
        public IHttpActionResult GetShapeById(int Id)
        {
            var shape = shapeService.GetShape(Id);
            if (shape != null)
            {
                return Ok(shape);
            }
            return NotFound();

        }
        [Route("GetShapeByCode/{code}")]
        public IHttpActionResult GetShapeByCode(string code)
        {
            var shape = shapeService.GetShape(code);
            if (shape != null)
            {
                return Ok(shape);
            }
            return NotFound();

        }

        [Route("getShape")]
        public IHttpActionResult GetShapeCategory()
        {
            var shape = shapeService.GetShape();
            if (shape != null)
            {
                return Ok(shape);
            }
            return NotFound();

        }

        [HttpPost]
        [Route("CreateShape")]
        public IHttpActionResult CreateShape(Shape shapeModel)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                if (shapeModel.Id != 0) {
                    shapeService.UpdateShape(shapeModel);
                }
                else {
                    shapeService.CreateShape(shapeModel);
                }
              
                return Ok();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [Route("getAllShape")]
        public IHttpActionResult GetAllShape()
        {
            var shape =  shapeService.GetShapes();
            if (shape != null)
            {
                return Ok(shape);
            }
            return NotFound();

        }
    }
}