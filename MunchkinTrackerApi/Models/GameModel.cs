using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace MunchkinTrackerApi.Models
{
    public class GameModel
    {
        [JsonProperty("code")]
        public string Code { get; set; }
    }
}