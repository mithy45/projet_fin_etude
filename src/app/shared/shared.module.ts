import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent, FooterComponent } from './components';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, HeaderComponent, FooterComponent
  ],
  exports: [
    HeaderComponent, FooterComponent
  ]
})
export class SharedModule { }
