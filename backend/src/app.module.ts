import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [FirebaseModule, FeaturesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
