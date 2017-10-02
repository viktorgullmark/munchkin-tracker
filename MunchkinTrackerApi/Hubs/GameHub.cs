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
    public class GameHub : Hub
    {
        private GameService _gameService;

        public GameHub(GameService gameService)
        {
            _gameService = gameService;
        }

        public void LevelChanged(string gameCode, Player player)
        {

            Clients.OthersInGroup(gameCode).LevelChanged(player);
        }

        public void PlayerJoined(string gameCode, Player player)
        {
            Clients.OthersInGroup(gameCode).PlayerJoined(player);
        }

        public void PlayerLeft(string gameCode, Player player)
        {
            Clients.OthersInGroup(gameCode).PlayerLeft(player);
        }

        public async Task<Game> CreateGame()
        {
            return await _gameService.CreateGame();
        }

        public async Task<IEnumerable<Player>> JoinGame(JoinModel model)
        {
            var nameTaken = await _gameService.IsNameTaken(model.Player.Name, model.GameCode);
            if (nameTaken)
            {
                Clients.Client(Context.ConnectionId).ErrorMessage("Name already taken");
                return null;
            }
            await _gameService.AddPlayer(model.Player, Context.ConnectionId, model.GameCode);
            await Groups.Add(Context.ConnectionId, model.GameCode);
            PlayerJoined(model.GameCode, model.Player);

            // return playernames for group
            return await _gameService.GetPlayersByCode(model.GameCode);    
        }

        public async Task LeaveGame(string gameCode)
        {   
            var player = await _gameService.RemovePlayer(Context.ConnectionId, gameCode);
            PlayerLeft(gameCode, player);
            try
            {
                await Groups.Remove(Context.ConnectionId, gameCode);
            }
            catch (TaskCanceledException e)
            {
                // thrown
            }
        }

        public void UpdatePlayer(JoinModel model)
        {
            LevelChanged(model.GameCode, model.Player);
        }
    }
}