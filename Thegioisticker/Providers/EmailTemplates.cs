using System;
using System.IO;

namespace Thegioisticker.API.Providers
{
    public static class EmailTemplates
    {
        static string testEmailTemplate;
        static string plainTextTestEmailTemplate;


        public static void Initialize()
        {
        }


        public static string GetTestEmail(string recepientName, DateTime testDate)
        {
            if (testEmailTemplate == null)
                testEmailTemplate = ReadPhysicalFile("Helpers/Templates/TestEmail.template");


            string emailMessage = testEmailTemplate
                .Replace("{user}", recepientName)
                .Replace("{testDate}", testDate.ToString());

            return emailMessage;
        }
        public static string GetResetPasswordEmail(string recepientName, string  token)
        {
            if (testEmailTemplate == null)
                testEmailTemplate = ReadPhysicalFile("Helpers/Templates/ResetPasswordEmail.template");


            string emailMessage = testEmailTemplate
                .Replace("{user}", recepientName)
                .Replace("{token}", token);

            return emailMessage;
        }



        public static string GetPlainTextTestEmail(DateTime date)
        {
            if (plainTextTestEmailTemplate == null)
                plainTextTestEmailTemplate = ReadPhysicalFile("Helpers/Templates/PlainTextTestEmail.template");


            string emailMessage = plainTextTestEmailTemplate
                .Replace("{date}", date.ToString());

            return emailMessage;
        }




        private static string ReadPhysicalFile(string path)
        {

            //if (!fileInfo.Exists)
            //    throw new FileNotFoundException($"Template file located at \"{path}\" was not found");

            //using (var fs = fileInfo.CreateReadStream())
            //{
            //    using (var sr = new StreamReader(fs))
            //    {
            //        return sr.ReadToEnd();
            //    }
            //}
            return "";
        }
    }
}
