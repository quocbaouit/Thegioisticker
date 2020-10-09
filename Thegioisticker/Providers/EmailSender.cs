using SendGrid;
using SendGrid.Helpers.Mail;
using System;
using System.Configuration;
using System.Threading.Tasks;

namespace Thegioisticker.API.Providers
{
    public class Emailmodel
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
    internal class EmailSender
    {
        public async Task Execute(string From, string To, string subject, string plainTextContent, string htmlContent)
        {
            var apiKey = ConfigurationManager.AppSettings["SendgridKey"];
            var client = new SendGridClient(apiKey);
            var from = new EmailAddress(From);
            var to = new EmailAddress(To);
            htmlContent = "<strong>" + htmlContent + "</strong>";
            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
            var response = await client.SendEmailAsync(msg);
        }

        public static string GetContentResetPassword(string templatePath,string callbackUrl)
        {
            System.IO.StreamReader objStreamReader = null;
            objStreamReader = System.IO.File.OpenText(templatePath);
            string sContent = objStreamReader.ReadToEnd().ToString();
            objStreamReader.Close();
            sContent = sContent.Replace("[Reset_Password_Url]", callbackUrl);
            return sContent;
        }
    }
}