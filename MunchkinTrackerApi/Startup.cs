using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
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

            
            app.MapSignalR("/signalr", config);
        }
    }
}

