import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    const logo = document.querySelectorAll('path');
    console.log(logo);
    for (let i = 0; i < logo.length; i++) {
      console.log(`Letter ${i} is ${logo[i].getTotalLength()}`);
    }
  }
}
