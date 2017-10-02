using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using MunchkinTrackerApi.Hubs;
using MunchkinTrackerBackend.Services;
using Owin;

[assembly: OwinStartup(typeof(MunchkinTrackerApi.Startup))]
namespace MunchkinTrackerApi
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            var config = new HubConfiguration()
            {
                EnableJSONP = true,
                EnableJavaScriptProxies = true
            };

            GlobalHost.DependencyResolver.Register(
                typeof(GameHub),
                () => new GameHub(new GameService()));

            app.MapSignalR("/signalr", config);
        }
    }
}

