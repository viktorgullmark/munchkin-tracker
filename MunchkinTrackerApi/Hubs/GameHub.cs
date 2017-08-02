using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.AspNet.SignalR;
using MunchkinTrackerApi.Models;
using MunchkinTrackerBackend.Entities;
using MunchkinTrackerBackend.Services;

namespace MunchkinTrackerApi.Hubs
{
    [EnableCors("*", "*", "*")]
    public class GameHub : Hub<IClient>
    {
        private readonly GameService _gameService = new GameService();

        public void LevelChanged(string gameCode, Player player)
        {
            Clients.Group(gameCode).LevelChanged(player);
        }

        public void PlayerJoined(string gameCode, Player player)
        {
            Clients.OthersInGroup(gameCode).PlayerJoined(player);
        }

        public void PlayerLeft(string gameCode, Player player)
        {
            Clients.OthersInGroup(gameCode).PlayerLeft(player);
        }

        public async Task<GameModel> CreateGame()
        {
            var game = await _gameService.CreateGame();
            return new GameModel()
            {
                Code = game.Code
            };
        }

        public async Task<IEnumerable<Player>> JoinGame(JoinModel model)
        {
            var nameTaken = await _gameService.IsNameTaken(model.Player.Name, model.GameCode);
            if (nameTaken)
            {
                Clients.Client(Context.ConnectionId).ErrorMessage("Name already taken");
                return null;
            }
            await _gameService.AddPlayer(model.Player.Name, Context.ConnectionId, model.GameCode);
            await Groups.Add(Context.ConnectionId, model.GameCode);
            PlayerJoined(model.GameCode, model.Player);

            // return playernames for group
            return await _gameService.GetPlayersByCode(model.GameCode);    
        }

        public async Task LeaveGame(JoinModel model)
        {   
            await _gameService.RemovePlayer(Context.ConnectionId, model.GameCode);
            PlayerLeft(model.GameCode, model.Player);
            try
            {
                await Groups.Remove(Context.ConnectionId, model.GameCode);
            }
            catch (TaskCanceledException e)
            {
                // thrown
            }
        }
    }

    public interface IClient
    {
        void PlayerJoined(Player player);
        void PlayerLeft(Player player);
        void LevelChanged(Player player);
        void ErrorMessage(string message);
    }
}