using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MunchkinTrackerBackend.DbContexts
{
    public class MunchkinTrackerDbContext : MTdbEntities
    {
        public static MunchkinTrackerDbContext Create()
        {
            return new MunchkinTrackerDbContext();
        }
    }
}
