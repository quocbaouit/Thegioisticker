using Thegioisticker.Model;
using System.Collections.Generic;
using System.Data.Entity;

namespace Thegioisticker.Data
{
    public class ThegioistickerSeedData : DropCreateDatabaseIfModelChanges<ThegioistickerEntities>
    {
        protected override void Seed(ThegioistickerEntities context)
        {
            context.Clients.AddRange(BuildClientsList());
            context.SaveChanges();
            context.Commit();
        }
        private static List<Client> BuildClientsList()
        {

            List<Client> ClientsList = new List<Client>
            {
                new Client
                { Id = "thegioistickerApp",
                    Secret= Helper.GetHash("abc@123"),
                    Name="AngularJS front-end Application",
                    ApplicationType =  ApplicationTypes.JavaScript,
                    Active = true,
                    RefreshTokenLifeTime = 7200,
                    AllowedOrigin = "http://ngauthenticationweb.azurewebsites.net"
                },
                new Client
                { Id = "consoleApp",
                    Secret=Helper.GetHash("123@abc"),
                    Name="Console Application",
                    ApplicationType = ApplicationTypes.NativeConfidential, 
                    Active = true,
                    RefreshTokenLifeTime = 14400,
                    AllowedOrigin = "*"
                }
            };

            return ClientsList;
        }
    }
}
