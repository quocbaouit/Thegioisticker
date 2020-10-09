namespace Thegioisticker.API.Mappings
{
    public class AutoMapperConfiguration
    {
        public static void Configure()
        {
            AutoMapper.Mapper.Initialize(cfg => cfg.AddProfile<AutoMapperProfile>());
        }
    }
}