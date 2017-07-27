using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MunchkinTrackerBackend.Interfaces;

namespace MunchkinTrackerBackend
{
    public partial class tblGame : IMunchkinTrackerEntity
    {
        public int Id => GameId;
    }
}
