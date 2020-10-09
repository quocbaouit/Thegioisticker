using System;

namespace Thegioisticker.Data.Infrastructure
{
    public interface IDbFactory : IDisposable
    {
        ThegioistickerEntities Init();
    }
}
