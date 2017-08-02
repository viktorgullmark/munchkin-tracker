using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using MunchkinTrackerApi.Models;
using MunchkinTrackerBackend;
using MunchkinTrackerBackend.Services;
using MunchkinTrackerBackend.Entities;

namespace MunchkinTrackerApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/Games")]
    public class GamesController : ApiController
    {
        private readonly GameService _gameService = new GameService();

        public GamesController()
        {
        }

        [HttpGet]
        [Route("Create")]
        public async Task<Game> Create()
        {
            return await _gameService.CreateGame();
        }
    }
}
