using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MunchkinTrackerBackend.Helpers
{
    public static class GameHelper
    {
        private static readonly Random Random = new Random();
        public static string GenerateGameCode()
        {
            const int length = 5;
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[Random.Next(s.Length)]).ToArray());
        }
    }
}
