import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwipeDirective } from './swipe.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SwipeDirective],
  exports: [SwipeDirective]
})
export class SwipeModule { }
