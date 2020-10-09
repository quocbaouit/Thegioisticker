using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace Thegioisticker.API.Custom
{
        public class CustomUploadMultipartFormProvider : MultipartFormDataStreamProvider
        {
            public CustomUploadMultipartFormProvider(string path) : base(path) { }

            public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
            {
                if (headers != null && headers.ContentDisposition != null)
                {
                    return headers
                        .ContentDisposition
                        .FileName.TrimEnd('"').TrimStart('"');
                }

                return base.GetLocalFileName(headers);
            }


        }
}