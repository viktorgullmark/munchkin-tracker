import { GamesPage } from '../pages/games/games';
import { CurrentGamePage } from '../pages/current-game/current-game';
import { SettingsPage } from '../pages/settings/settings';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { PlayerDetailsPage } from '../pages/player-details/player-details';
import { EnterGameModule } from '../components/enter-game/enter-game.module';
import { InterceptorProvider } from '../providers/interceptor/interceptor';
import { MyApp } from './app.component';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SignalRModule } from 'ng2-signalr';
import { SignalRConfiguration } from 'ng2-signalr';
import { GameProvider } from '../providers/game/game';

@NgModule({
  declarations: [
    MyApp,
    GamesPage,
    CurrentGamePage,
    SettingsPage,
    TabsControllerPage,
    PlayerDetailsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    SignalRModule.forRoot(createConfig),
    IonicModule.forRoot(MyApp),
    EnterGameModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GamesPage,
    CurrentGamePage,
    SettingsPage,
    TabsControllerPage,
    PlayerDetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InterceptorProvider,
    GameProvider
  ]
})
export class AppModule { }

export function createConfig(): SignalRConfiguration {
  const c = new SignalRConfiguration();
  c.hubName = 'GameHub';
  c.withCredentials = false;
  c.jsonp = true;
  c.url = 'http://localhost:55787';
  c.logging = true;
  return c;
}
