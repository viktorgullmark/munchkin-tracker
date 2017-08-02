using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MunchkinTrackerBackend.Entities
{
    [Serializable]
    public class Game
    {
        public Game()
        {
            Players = new List<Player>();
        }
        public string Code { get; set; }
        public List<Player> Players { get; set; }
    }
}
