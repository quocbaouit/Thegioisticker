using Thegioisticker.Data.Infrastructure;
using Thegioisticker.Data.Repositories;
using Thegioisticker.Model;
using System.Collections.Generic;
using System.Linq;

namespace Thegioisticker.Service
{
    // operations you want to expose
    public interface ISampleService
    {
        IEnumerable<Sample> GetSamples();
        IEnumerable<Sample> GetSamplesByShape(int shapeId);
        Sample GetSample(int id);
        Sample GetSample(string code);
        void CreateSample(Sample Sample);
        void UpdateSample(Sample Sample);
        List<Shape> GetShape();
        void SaveSample();
        SamplePaging GetPagingSample(int pageIndex, int pageSize,int category);
    }

    public class SampleService : ISampleService
    {
        private readonly ISampleRepository SamplesRepository;
        private readonly IShapeRepository shapesRepository;
        private readonly IUnitOfWork unitOfWork;

        public SampleService(ISampleRepository SamplesRepository, IShapeRepository shapeRepository, IUnitOfWork unitOfWork)
        {
            this.SamplesRepository = SamplesRepository;
            this.shapesRepository = shapeRepository;
            this.unitOfWork = unitOfWork;
        }

        #region ISampleService Members
        public SamplePaging GetPagingSample(int pageIndex, int pageSize,int category)
        {
            var allData = SamplesRepository.GetMany(x => !x.isDelete && x.ShapeId== category).Select(x => new { x.Id, x.Image, x.Code, x.Name, x.Description, x.SeoUrl }).ToList();
            var Blogs = allData.Select(y => new Sample()
            {
                Id = y.Id,
                Image = y.Image,
                Description = y.Description,
                Name = y.Name,
                Code = y.Code,
                SeoUrl = y.SeoUrl
            }).ToList();
            var pager = new Pager(Blogs.Count(), pageIndex, pageSize);
            var items = Blogs.Skip((pager.CurrentPage - 1) * pager.PageSize).Take(pager.PageSize).ToList();
            var samplePaging = new SamplePaging
            {
                Items = items,
                Pager = pager
            };
            return samplePaging;
        }
        public IEnumerable<Sample> GetSamples()
        {
            var Samples = SamplesRepository.GetMany(x=>!x.isDelete);
            return Samples;
        }
        public IEnumerable<Sample> GetSamplesByShape(int shapeId)
        {
            var Samples = SamplesRepository.GetMany(x => !x.isDelete && x.ShapeId== shapeId);
            return Samples;
        }
        private int CountSample()
        {
            var result = SamplesRepository.GetMany(x => !x.isDelete).Count();
            return result;
        }

        public List<Shape> GetShape()
        {
            var listCategory = new List<Shape>() {new Shape(){
                Id = 0,
                Name = "Mẫu",
            }};
            var sampleCategory =  shapesRepository.GetAll().Select(
                x => new Shape()
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();
            listCategory.AddRange(sampleCategory);
            return listCategory;
        }

        public Sample GetSample(int id)
        {
            var Sample = SamplesRepository.GetById(id);
            return Sample;
        }
        public void UpdateSample(Sample Sample)
        {
            SamplesRepository.Update(Sample);
            SaveSample();
        }

        public void CreateSample(Sample Sample)
        {
            SamplesRepository.Add(Sample);
            SaveSample();
        }

        public void SaveSample()
        {
            unitOfWork.Commit();
        }

        public Sample GetSample(string code)
        {
            var Sample = SamplesRepository.GetMany(x=>!x.isDelete && x.Code==code).FirstOrDefault();
            return Sample;
        }

        #endregion

    }
}
