import { Component, OnInit, OnDestroy } from '@angular/core';

import { ServersService } from '../servers.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router, Data } from '@angular/router';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  server: {id: number, name: string, status: string};
  serverId: Subscription;

  constructor(
    private serversService: ServersService, 
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Data) => {
          this.server = data['server'];
        }
      );
/*     this.server = this.serversService.getServer(1);

    this.serverId = this.route.params.subscribe(
      (params: Params) => {
        if(params.id) {
          this.server = this.serversService.getServer(parseInt(params.id));
        }
      }
    ) */
  }

  onEdit(serverIdToLoad: number) {
    this.router.navigate(['edit'], { relativeTo : this.route, queryParamsHandling: 'preserve'});
  }

}
