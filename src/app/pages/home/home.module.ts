import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePage } from './containers/home/home.page';
// import {MatFormFieldModule} from '@angular/material/form-field';

import { ReactiveFormsModule } from '@angular/forms'
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';




import { EffectsModule } from '@ngrx/effects';
import { CurrentWeatherComponent } from './components/current-weather/current-weather.component';

import {MatCardModule} from '@angular/material/card';
import { ComponentsModule } from 'src/app/shared/components/components.module';



import { HomeEffects } from './state/home.effects';
import { homeReducer } from './state/home.reducer';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from 'src/app/app-routing.module';



@NgModule({
  declarations: [
    HomePage,
    CurrentWeatherComponent,
  
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    StoreModule.forFeature('home',homeReducer),
    EffectsModule.forFeature([HomeEffects]),
    ComponentsModule,
    
  ]
})
export class HomeModule { }
