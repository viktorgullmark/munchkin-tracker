using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CachingFramework.Redis;
using MunchkinTrackerBackend.Entities;
using MunchkinTrackerBackend.Repositories;
using MunchkinTrackerBackend.Helpers;

namespace MunchkinTrackerBackend.Services
{
    public class GameService
    {
        public void Dispose()
        {
        }

        private readonly Context _context = new Context();

        TblGameRepository GameRepo => new TblGameRepository(_context);

        public async Task<Game> GetGameByCode(string gameCode)
        {
            return await GameRepo.FindByCode(gameCode);
        }

        public async Task<IEnumerable<Player>> GetPlayersByCode(string gameCode)
        {
            return await GameRepo.FindPlayersByCode(gameCode);
        }

        public async Task<bool> IsNameTaken(string playerName, string gameCode)
        {
            return await GameRepo.NameTaken(playerName, gameCode);
        }

        public async Task AddPlayer(Player player, string connectionId, string gameCode)
        {
            var game = await GameRepo.FindByCode(gameCode);
            game.Players.Add(new Player()
            {
                ConnectionId = connectionId,
                Name = player.Name,
                Flavor = player.Flavor,
                Bonus = 0,
                Level = 0,
                Gender = player.Gender
            });
            await GameRepo.Update(game);
        }

        public async Task<Player> RemovePlayer(string connectionId, string gameCode)
        {
            var game = await GameRepo.FindByCode(gameCode);
            var player = game.Players.FirstOrDefault(x => x.ConnectionId == connectionId);
            game.Players.RemoveAll(x => x.ConnectionId == connectionId);
            await GameRepo.Update(game);
            return player;
        }

        public async Task<Game> CreateGame()
        {
            var game = new Game()
            {
                Code = GameHelper.GenerateGameCode(),
                Players = new List<Player>()
            };
            await GameRepo.Insert(game);
            return game;
        }
    }
}