using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MunchkinTrackerBackend.Repositories;
using MunchkinTrackerBackend.DbContexts;

namespace MunchkinTrackerBackend.Services
{
    public class GameService
    {
        public void Dispose()
        {
        }

        private readonly MunchkinTrackerDbContext _dbContext = MunchkinTrackerDbContext.Create();

        TblGameRepository GameRepo => new TblGameRepository(_dbContext);

        public async Task<tblGame> GetGameById(int gameId)
        {
            return await GameRepo.FindAsync(x => x.GameId == gameId);
        }
    }
}