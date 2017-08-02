import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SignalRModule } from 'ng2-signalr';
import { SignalRConfiguration } from 'ng2-signalr';

import { CurrentGamePage } from '../pages/current-game/current-game';
import { GamesPage } from '../pages/games/games';
import { PlayerDetailsPage } from '../pages/player-details/player-details';
import { SettingsPage } from '../pages/settings/settings';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { GameProvider } from '../providers/game/game';
import { InterceptorProvider } from '../providers/interceptor/interceptor';
import { MyApp } from './app.component';

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
    IonicModule.forRoot(MyApp)
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
