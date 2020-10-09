using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

namespace Thegioisticker.Service
{
    public interface IBlobStorageService
    {
        string UploadProfilePhoto(int userId, string strFileName, byte[] fileData, string fileMimeType);
        void DeleteBlobData(string fileUrl);
       List<string> GetFileNames(string transactionId);
        void UploadFromStreamAsync(string strFileName, Stream source, string strContainerName);
    }
    public static class Common
    {
        /// <summary>
        /// Validates the connection string information in app.config and throws an exception if it looks like 
        /// the user hasn't updated this to valid values. 
        /// </summary>
        /// <returns>CloudStorageAccount object</returns>
        public static CloudStorageAccount GetStorageAccount()
        {
            CloudStorageAccount storageAccount;
            const string Message = "Invalid storage account information provided. Please confirm the AccountName and AccountKey are valid in the app.config file - then restart the sample.";

            try
            {
                storageAccount = CloudStorageAccount.Parse(Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));
            }
            catch (FormatException)
            {
                Console.WriteLine(Message);
                Console.ReadLine();
                throw;
            }
            catch (ArgumentException)
            {
                Console.WriteLine(Message);
                Console.ReadLine();
                throw;
            }

            return storageAccount;
        }
    }
    public class BlobStorageService: IBlobStorageService
    {    
        public BlobStorageService()
        {
        }
        public string UploadProfilePhoto(int userId, string strFileName, byte[] fileData, string fileMimeType)
        {
            try
            {
                var fileName = strFileName.Split('.');
                var fileExtention = fileName[fileName.Length - 1];
                //var user = _userRepository.GetSingleOrDefault(x => x.Id == userId);

                //userId = _context.CurrentUserId;
                var profilePhoto = userId + "." + fileExtention;
                string strContainerName = "userprofile";
                var _task = Task.Run(() => this.UploadFileToBlobAsync(profilePhoto, fileData, fileMimeType, strContainerName));
                _task.Wait();
                string fileUrl = _task.Result;
                //user.ProfilePhotoUrl = profilePhoto;
                //_userRepository.Update(user);
                //_unitOfWork.SaveChanges();
                return fileUrl;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }
        public  void DeleteBlobData(string directoryReference)
        {

            CloudStorageAccount cloudStorageAccount = Common.GetStorageAccount();
            CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
            string strContainerName = ServiceConstants.ContainerReference;
            CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(strContainerName);

            // get block blob refarence 
            foreach (IListBlobItem blob in cloudBlobContainer.GetDirectoryReference(directoryReference).ListBlobs(true))
            {
                if (blob.GetType() == typeof(CloudBlob) || blob.GetType().BaseType == typeof(CloudBlob))
                {
                    ((CloudBlob)blob).DeleteIfExists();
                }
            }
        }

        private async Task<string> UploadFileToBlobAsync(string strFileName, byte[] fileData, string fileMimeType, string strContainerName)
        {
            try
            {             
                CloudStorageAccount cloudStorageAccount = Common.GetStorageAccount(); ;
                CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
                
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(strContainerName);
                if (await cloudBlobContainer.CreateIfNotExistsAsync())
                {
                    await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
                }

                if (strFileName != null && fileData != null)
                {
                    CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(strFileName);
                    cloudBlockBlob.Properties.ContentType = fileMimeType;
                    await cloudBlockBlob.UploadFromByteArrayAsync(fileData, 0, fileData.Length);
                    return cloudBlockBlob.Uri.AbsoluteUri;
                }
                return "";
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }
        private async void UploadFromStreamAsync(string strFileName, Stream source, string fileMimeType, string strContainerName)
        {
            try
            {
                CloudStorageAccount cloudStorageAccount = Common.GetStorageAccount(); ;
                CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();

                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(strContainerName);
                if (await cloudBlobContainer.CreateIfNotExistsAsync())
                {
                    await cloudBlobContainer.SetPermissionsAsync(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
                }             
                    CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(strFileName);
                    cloudBlockBlob.Properties.ContentType = fileMimeType;
                    cloudBlockBlob.UploadFromStream(source);               
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }

        private List<string> GetBlobFileNames(string strContainerName)
        {
            try
            {
                CloudStorageAccount cloudStorageAccount = Common.GetStorageAccount();
                CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
                List<string> results = new List<string>();

                CloudBlobContainer cloudBlobContainer =  cloudBlobClient.GetContainerReference(ServiceConstants.ContainerReference);
                results.AddRange(cloudBlobContainer.GetDirectoryReference(strContainerName).ListBlobs(true).Select(x => x.Uri.ToString()));
                return results;
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }

        private async Task<List<IListBlobItem>> ListBlobsAsync(CloudBlobContainer container)
        {
            BlobContinuationToken continuationToken = null; //start at the beginning
            var results = new List<IListBlobItem>();
            do
            {
                var response = await container.ListBlobsSegmentedAsync(continuationToken);
                continuationToken = response.ContinuationToken;
                results.AddRange(response.Results);
            }

            while (continuationToken != null); //when this is null again, we've reached the end
            return results;
        }

        public List<string> GetFileNames(string transactionId)
        {
            return  GetBlobFileNames(transactionId);
        }

        void IBlobStorageService.UploadFromStreamAsync(string strFileName, Stream source, string strContainerName)
        {
            try
            {
                CloudStorageAccount cloudStorageAccount = Common.GetStorageAccount(); ;
                CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();
                CloudBlobContainer cloudBlobContainer = cloudBlobClient.GetContainerReference(ServiceConstants.ContainerReference);
                var directory = cloudBlobContainer.GetDirectoryReference(strContainerName);
                CloudBlockBlob cloudBlockBlob = directory.GetBlockBlobReference(strFileName);
                cloudBlockBlob.UploadFromStream(source);
            }
            catch (Exception ex)
            {
                throw (ex);
            }
        }
    }
}
