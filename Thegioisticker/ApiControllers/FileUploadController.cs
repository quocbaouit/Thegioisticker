using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using System.Threading.Tasks;
using Thegioisticker.API.Custom;
using System.IO;
using Thegioisticker.Service;
using Thegioisticker.API.Constants;

namespace Thegioisticker.API.Controllers
{
    public class FileUploadController : ApiController
    {
        private readonly IBlobStorageService _blobStorageService;
        public FileUploadController(IBlobStorageService blobStorageService)
        {
            this._blobStorageService = blobStorageService;
        }
        [Route("api/upload")]
        public async Task<HttpResponseMessage> Post(string identifier)
        {
            try
            {
                string clientAddress = HttpContext.Current.Request.UserHostAddress;
                if (!Request.Content.IsMimeMultipartContent())
                {
                    throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
                }
                //var fileNames = _blobStorageService.GetFileNames("0ba78538-af43-9802-249e-f489178a7bea");
                //Save To this server location
                var uploadPath = HttpContext.Current.Server.MapPath("~/Uploads");
                string subPath = "ImagesPath"; // your code goes here

                bool exists = System.IO.Directory.Exists(HttpContext.Current.Server.MapPath(subPath));

                if (!exists)
                    System.IO.Directory.CreateDirectory(HttpContext.Current.Server.MapPath(subPath));
                //Save file via CustomUploadMultipartFormProvider
                var multipartFormDataStreamProvider = new CustomUploadMultipartFormProvider(Path.GetTempPath());

                var provider = new MultipartFormDataStreamProvider(Path.GetTempPath());

                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);

                foreach (var fileData in provider.FileData)
                {
                    string fileName = fileData.Headers.ContentDisposition.FileName;
                    if (fileName.StartsWith("\"") && fileName.EndsWith("\""))
                    {
                        fileName = fileName.Trim('"');
                    }
                    if (fileName.Contains(@"/") || fileName.Contains(@"\"))
                    {
                        fileName = Path.GetFileName(fileName);
                    }
                    using (var filestream = File.OpenRead(fileData.LocalFileName))
                    {
                        _blobStorageService.UploadFromStreamAsync(fileName, filestream, identifier);
                    }
                    File.Delete(fileData.LocalFileName);
                }

                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            catch (Exception e)
            {
                return new HttpResponseMessage(HttpStatusCode.NotImplemented)
                {
                    Content = new StringContent(e.Message)
                };
            }
        }

        [Route("api/uploadTolocal")]
        public async Task<HttpResponseMessage> Post(int imageType)
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
                }

                //Save To this server location
                var uploadPath = "";
                switch (imageType)
                {
                    case (int)ImageType.Blog:
                        uploadPath = Contants.BlogsUrl;
                        break;
                    case (int)ImageType.Product:
                        uploadPath = Contants.ProductsUrl;
                        break;
                    case (int)ImageType.Sample:
                        uploadPath = Contants.SamplesUrl;
                        break;
                    default:
                        uploadPath = "~/Uploads";
                        break;
                }
                uploadPath = HttpContext.Current.Server.MapPath(uploadPath);
                //The reason we not use the default MultipartFormDataStreamProvider is because
                //the saved file name is look weird, not believe me? uncomment below and try out, 
                //the odd file name is designed for security reason -_-'.
                //var streamProvider = new MultipartFormDataStreamProvider(uploadPath);

                //Save file via CustomUploadMultipartFormProvider
                var multipartFormDataStreamProvider = new CustomUploadMultipartFormProvider(uploadPath);

                // Read the MIME multipart asynchronously 
                await Request.Content.ReadAsMultipartAsync(multipartFormDataStreamProvider);
                string fileName = "";
                foreach (var fileData in multipartFormDataStreamProvider.FileData)
                {
                     fileName = fileData.Headers.ContentDisposition.FileName;
                    if (fileName.StartsWith("\"") && fileName.EndsWith("\""))
                    {
                        fileName = fileName.Trim('"');
                        switch (imageType)
                        {
                            case (int)ImageType.Blog:
                                uploadPath = Contants.BlogsUrl.Trim('~');
                                break;
                            case (int)ImageType.Product:
                                uploadPath = Contants.ProductsUrl.Trim('~');
                                break;
                            case (int)ImageType.Sample:
                                uploadPath = Contants.SamplesUrl.Trim('~');
                                break;
                            default:
                                uploadPath = "/Uploads";
                                break;
                        }
                        
                        fileName = string.Format("{0}/{1}", uploadPath,fileName);
                    }
                    //if (fileName.Contains(@"/") || fileName.Contains(@"\"))
                    //{
                    //    fileName = Path.GetFileName(fileName);
                    //}
                }

                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(fileName)
                };
            }
            catch (Exception e)
            {
                return new HttpResponseMessage(HttpStatusCode.NotImplemented)
                {
                    Content = new StringContent(e.Message)
                };
            }
        }

        [HttpGet]
        [Route("api/upload/getListFileName/{transactionId}")]
        public IHttpActionResult GetListFileName(string transactionId)
        {
            var fileNames = _blobStorageService.GetFileNames(transactionId);
            if (fileNames != null)
                return Ok(fileNames);
            return NotFound();
        }

        //[HttpPost]
        //[Route("deleteCustomer")]
        //public IHttpActionResult DeleteCustomer(Customer customerModel)
        //{
        //    try
        //    {
        //        if (!ModelState.IsValid)
        //        {
        //            return BadRequest(ModelState);
        //        }
        //        if (customerModel.Id != 0)
        //        {
        //            customerModel.isDelete = true;
        //            customerService.UpdateCustomer(customerModel);
        //        }

        //        return Ok();
        //    }
        //    catch (Exception)
        //    {
        //        return BadRequest();
        //    }
        //}
    }
}