using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace MunchkinTrackerBackend.Entities
{
    [Serializable]
    public class Player
    {
        public string ConnectionId { get; set; }

        public string Name { get; set; }

        public int Level { get; set; }

        public int Bonus { get; set; }
    }
}
