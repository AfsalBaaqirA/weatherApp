import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/enums/enums';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  title = 'Dashboard';
  currentUser!: User;
  data: any;
  weather!: string;
  showWeather!: boolean;
  day!: boolean;
  cold!: boolean;
  wind!: string;
  humidity!: string;
  locationName!: { city: string; state: string; country: string };
  temperature!: string;
  location!: { latitude: number; longitude: number } | undefined;
  currentDate = new Date();

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.titleService.setTitle(this.title);
    this.getLoc();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.data = params;
      this.showWeather = false;
      this.currentUser = {
        username: this.data.username,
        password: this.data.password,
        name: this.data.name,
        email: this.data.email,
        phoneNo: this.data.phoneNo,
      };
      console.log(this.currentUser);
    });
  }

  getWeather() {
    const key = '253ddf8d58a2455184e55952221101';
    const url =
      'https://api.weatherapi.com/v1/current.json?key=' +
      key +
      '&q=' +
      this.location?.latitude +
      ',' +
      this.location?.longitude +
      '&aqi=no';
    this.http.get(url).subscribe((data) => {
      console.log(data);
      this.data = data;
      this.showWeather = true;
      this.weather = 'Sunny';
      this.data.current.condition.text.includes('cloudy')
        ? (this.weather = 'Cloudy')
        : (this.weather = this.weather);
      this.data.current.condition.text.includes('rain' || 'drizzle')
        ? (this.weather = 'Rainy')
        : (this.weather = this.weather);
      this.data.current.condition.text.includes('snow' || 'sleet' || 'ice')
        ? (this.weather = 'Snowy')
        : (this.weather = this.weather);
      this.data.current.condition.text.includes('thunder')
        ? (this.weather = 'Stormy')
        : (this.weather = this.weather);
      this.data.current.is_day == 1 ? (this.day = true) : (this.day = false);
      this.data.current.temp_c < 20 ? (this.cold = true) : (this.cold = false);
      this.locationName = {
        city: this.data.location.name,
        state: this.data.location.region,
        country: this.data.location.country,
      };
      this.temperature = this.data.current.temp_c + '°C';
      this.wind = this.data.current.wind_kph + ' km/h';
      this.humidity = this.data.current.humidity + '%';

      console.log(
        this.weather,
        this.day,
        this.cold,
        this.locationName,
        this.temperature
      );
    });
  }

  logout() {
    this.router.navigate(['/login']);
  }
  getLoc() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      },
      (error) => console.log('Cannot get your location'),
      { enableHighAccuracy: true }
    );
  }
}
