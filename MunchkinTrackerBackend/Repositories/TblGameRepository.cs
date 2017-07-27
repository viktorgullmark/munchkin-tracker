using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MunchkinTrackerBackend.DbContexts;

namespace MunchkinTrackerBackend.Repositories
{
    public class TblGameRepository : GenericRepository<MunchkinTrackerDbContext, tblGame>
    {
        public TblGameRepository()
        {
        }

        public TblGameRepository(MunchkinTrackerDbContext dbContext)
        {
            DbContext = dbContext;
        }
    }
}
