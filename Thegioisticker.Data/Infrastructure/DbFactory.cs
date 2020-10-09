namespace Thegioisticker.Data.Infrastructure
{
    public class DbFactory : Disposable, IDbFactory
    {
        ThegioistickerEntities dbContext;

        public ThegioistickerEntities Init()
        {
            return dbContext ?? (dbContext = new ThegioistickerEntities());
        }

        protected override void DisposeCore()
        {
            if (dbContext != null)
                dbContext.Dispose();
        }
    }
}
