import { NgModule } from '@angular/core';


// Pipes
import { TranslatePipe } from './translate.pipe';

@NgModule({
declarations: [TranslatePipe],
imports: [],
exports: [TranslatePipe],
providers: [TranslatePipe]
})

export class PipesModule {}