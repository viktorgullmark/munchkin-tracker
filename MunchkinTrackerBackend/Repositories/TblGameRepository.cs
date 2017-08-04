using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CachingFramework.Redis;
using MunchkinTrackerBackend.Entities;

namespace MunchkinTrackerBackend.Repositories
{
    public class TblGameRepository
    {
        private readonly Context _context;
        public TblGameRepository()
        {
        }

        public TblGameRepository(Context context)
        {
            _context = context;
        }

        public async Task<Game> FindByCode(string gameCode)
        {
            return await _context.Cache.GetObjectAsync<Game>($"game:{gameCode}");
        }

        public async Task<bool> NameTaken(string playerName, string gameCode)
        {
            var game = await _context.Cache.GetObjectAsync<Game>($"game:{gameCode}");
            return game.Players.FirstOrDefault(x => x.Name == playerName) != null;
        }

        public async Task<IEnumerable<Player>> FindPlayersByCode(string gameCode)
        {
            var game = await _context.Cache.GetObjectAsync<Game>($"game:{gameCode}");
            var players = game.Players.ToList();
            return players;
        }

        public async Task Insert(Game game)
        {
            await _context.Cache.SetObjectAsync($"game:{game.Code}", game, TimeSpan.FromHours(1));
        }

        public async Task Delete(Game game)
        {
            await _context.Cache.RemoveAsync($"game:{game.Code}");
        }

        public async Task Update(Game game)
        {
            await _context.Cache.SetObjectAsync($"game:{game.Code}", game, TimeSpan.FromHours(1));
        }
    }
}
