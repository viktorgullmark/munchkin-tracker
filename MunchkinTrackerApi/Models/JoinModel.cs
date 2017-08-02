using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MunchkinTrackerBackend.Entities;
using Newtonsoft.Json;

namespace MunchkinTrackerApi.Models
{
    public class JoinModel
    {
        [JsonProperty("player")]
        public Player Player { get; set; }

        [JsonProperty("gameCode")]
        public string GameCode { get; set; }
    }
}