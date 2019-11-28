import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../service/translate.service';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(key: any, type: any, subType: any, subSubType: any): any {
    if (subSubType !== null && subSubType === '') {
      subSubType = 'default';
    }

    if (type && this.translate.data[type]) {
      if (subType && this.translate.data[type][subType]) {
        if (subSubType && this.translate.data[type][subType][subSubType]) {
          if (this.translate.data[type][subType][subSubType][key]) {

            return this.translate.data[type][subType][subSubType][key];
          } else {
            return 'NO';
          }
        }
        if (typeof this.translate.data[type][subType][key] || typeof this.translate.data[type][subType][key] !== 'object') {
          return this.translate.data[type][subType][key];
        }
      }
      if (this.translate.data[type][key] && typeof this.translate.data[type][key] !== 'object') {
        return this.translate.data[type][key];
      }
    }
    let error = 'unkown: ';
    error += type ? 'type ' + type + ', ' : '';
    error += subType ? 'subType ' + subType + ', ' : '';
    error += subSubType ? 'subSubType ' + subSubType + ', ' : '';
    error += 'key:' + key;
    return error;
  }
}
