using Thegioisticker.API.Mappings;

namespace Thegioisticker.API.App_Start
{
    /// <summary>
    /// 
    /// </summary>
    public static class Bootstrapper
    {
        /// <summary>
        /// 
        /// </summary>
        public static void Run()
        {
            AutoMapperConfiguration.Configure();
        }
    }
}