using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface IShapeService
    {
        IEnumerable<Shape> GetShapes();
        Shape GetShape(int id);
        Shape GetShape(string code);
        void CreateShape(Shape Shape);
        void UpdateShape(Shape Shape);
        List<Shape> GetShape();
        void SaveShape();
    }

    public class ShapeService : IShapeService
    {
        private readonly IShapeRepository ShapesRepository;
        private readonly IUnitOfWork unitOfWork;

        public ShapeService(IShapeRepository ShapesRepository, IUnitOfWork unitOfWork)
        {
            this.ShapesRepository = ShapesRepository;
            this.unitOfWork = unitOfWork;
        }

        #region IShapeService Members

        public IEnumerable<Shape> GetShapes()
        {
            var shapes = ShapesRepository.GetMany(x=>!x.IsDeleted).ToList();
         
            return shapes;
        }
        private int CountShape()
        {
            var result = ShapesRepository.GetMany(x => !x.IsDeleted).Count();
            return result;
        }

        public List<Shape> GetShape()
        {
            var listCategory = new List<Shape>() {new Shape(){
                Id = 0,
                Name = "Mẫu",
            }};
            var sampleCategory = ShapesRepository.GetAll().Select(
                x => new Shape()
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();
            listCategory.AddRange(sampleCategory);
            return listCategory;
        }

        public Shape GetShape(int id)
        {
            var shape = ShapesRepository.GetById(id);
            if (shape == null)
            {
                shape = new Shape() { Id = 0, Name = "Mặc Định" };
            }
            return shape;
        }
        public void UpdateShape(Shape Shape)
        {
            ShapesRepository.Update(Shape);
            SaveShape();
        }

        public void CreateShape(Shape Shape)
        {
            ShapesRepository.Add(Shape);
            SaveShape();
        }

        public void SaveShape()
        {
            unitOfWork.Commit();
        }

        public Shape GetShape(string code)
        {
            var Shape = ShapesRepository.GetMany(x=>!x.IsActive && x.Code==code).FirstOrDefault();
            return Shape;
        }

        #endregion

    }
}
