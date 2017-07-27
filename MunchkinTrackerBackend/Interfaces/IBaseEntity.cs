using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MunchkinTrackerBackend.Interfaces
{
    interface IMunchkinTrackerEntity
    {
        DateTime Created { get; set; }
        DateTime Modified { get; set; }
    }
}
