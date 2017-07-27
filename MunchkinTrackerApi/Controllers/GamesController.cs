using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;
using MunchkinTrackerBackend;
using MunchkinTrackerBackend.Services;

namespace MunchkinTrackerApi.Controllers
{
    [EnableCors("*", "*", "*")]
    public class GamesController : ApiController
    {
        private readonly GameService _gameService = new GameService();

        public GamesController()
        {
        }

        public async Task<tblGame> Get(int id)
        {
            var game = await _gameService.GetGameById(id);
            return game;
        }

        public async void Post([FromBody]string value)
        {
        }

        public async void Put(int id, [FromBody]string value)
        {
        }

        public async void Delete(int id)
        {
        }
    }
}
