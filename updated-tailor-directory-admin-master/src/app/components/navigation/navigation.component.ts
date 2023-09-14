import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  isHidden: boolean;

  constructor(
    private router: Router
  ) {
    this.router.events.forEach(event => {
      if (event instanceof NavigationStart) {
        this.isHidden = event.url.includes('/login');
      }
    })
  }

  ngOnInit(): void {
  }

}
