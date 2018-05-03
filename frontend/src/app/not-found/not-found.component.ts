import { Component, OnInit } from '@angular/core';
import {Config} from '../config/config';
import {ConfigService} from '../config/config.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './not-found.component.html',
  styleUrls: ['../card.css']
})
export class NotFoundComponent implements OnInit {
    config: Config;

    ngOnInit() {
    }

    constructor(private configService: ConfigService) {
        this.config = configService.getConfig();
    }
}
