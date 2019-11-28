import { Injectable } from '@angular/core';

@Injectable()
export class WeatherService {
  ICONS = {
    'clear-night': 'clear_night.png',
    cloudy: 'cloudy.png',
    overcast: 'cloudy.png',
    fog: 'fog.png',
    hail: 'mixed_rain.png',
    lightning: 'lightning.png',
    'lightning-rainy': 'storm.png',
    partlycloudy: 'mostly_cloudy.png',
    pouring: 'heavy_rain.png',
    rainy: 'rainy.png',
    snowy: 'snowy.png',
    'snowy-rainy': 'mixed_rain.png',
    sunny: 'sunny.png',
    windy: 'windy.svg',
    'windy-variant': 'windy.svg',
    humidity: 'humidity.svg',
  };
  ICONS_NIGHT = {
    ...this.ICONS,
    sunny: 'clear_night.png',
    partlycloudy: 'mostly_cloudy_night.png',
    'lightning-rainy': 'storm_night.png',
  };
  INFO = {
    precipitation: { icon: 'rainy', unit: 'length' },
    humidity: { icon: 'humidity', unit: '%' },
    wind_speed: { icon: 'windy', unit: 'speed' },
  };
  constructor() {}

  weatherIcon(entities, weather, icon = null) {
    if (!icon) {
      icon = entities[weather].state.toLowerCase();
    }
    const iconFile = this.isNight(entities) ? this.ICONS_NIGHT[icon] : this.ICONS[icon];

    return 'assets/weather-icons/' + iconFile;
  }

  getUnit(unit = 'temperature') {
    const target = unit === 'speed' ? 'length' : unit;
    if (unit === 'temperature') {
      return '°C';
    } else if (unit === 'length') {
      return 'mm';
    } else if (unit === 'speed') {
      return 'km/h';
    }
    return unit;
  }

  renderExtrema(high: any, low: any) {
    let html = '';
    if (high || low) {
      html += '<span>';
      if (high) {
        html += high + this.getUnit();
      }
      if (high && low) {
        html += ' / ';
      }
      if (low) {
        html += low + this.getUnit();
      }
      html += '</span>';
    }
    return html;
  }

  isNight(entities) {
    if (entities) {
      return entities['sun.sun'] ? entities['sun.sun'].state === 'below_horizon' : false;
    }
    return false;
  }

  isCloudy(entities, weather) {
    if (weather && entities) {
      const weatherState = entities[weather].state;
      if (weatherState.includes('rain') || weatherState.includes('cloud')) {
        return true;
      }
      return false;
    }
    return false;
  }
}
