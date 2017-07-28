using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Cors;
using Microsoft.AspNet.SignalR;

namespace MunchkinTrackerApi.Hubs
{
    [EnableCors("*", "*", "*")]
    public class TestHub : Hub<IClient>
    {
        public void TestMessage(string message)
        {
            Clients.All.NewMessage(message);
        }
    }

    public interface IClient
    {
        void NewMessage(string message);
    }
}