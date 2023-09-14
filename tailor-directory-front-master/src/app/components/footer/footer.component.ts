import {Component} from '@angular/core';
import {SocialLinkModel} from '../../models/socialLink.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  year = new Date().getFullYear();
  socialLinks: SocialLinkModel[] = [
    {
      name: 'Facebook',
      link: 'https://www.facebook.com',
      icon: 'facebook.svg'
    },
    {
      name: 'Telegram',
      link: 'tg://resolve?domain=tailorDirectory',
      icon: 'telegramm.svg'
    },
    {
      name: 'Instagram',
      link: 'https://www.instagram.com',
      icon: 'instagramm.svg'
    },
    {
      name: 'Viber',
      link: 'viber://chat?number=+123456789',
      icon: 'viber.svg'
    }
  ];

}
