import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { FeaturesModule } from './features/features.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [FirebaseModule, FeaturesModule, AssetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
