import { Component, OnInit, OnDestroy } from '@angular/core';

import { ServersService } from '../servers.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { CanComponentDeactivate } from './can-deactivated-guard.service';

@Component({
  selector: 'app-edit-server',
  templateUrl: './edit-server.component.html',
  styleUrls: ['./edit-server.component.css']
})
export class EditServerComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  onServerChanged: Subscription;
  onQueryParamsChanged: Subscription;
  server: {id: number, name: string, status: string};
  allowEdit = false;
  changesSaved = false;
  serverName = '';
  serverStatus = '';

  constructor(private serversService: ServersService, 
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.server = this.serversService.getServer(1);

    this.onServerChanged = this.route.params.subscribe(
      (params: Params) => {
        this.server = (params.id) ? this.serversService.getServer(parseInt(params.id)) : this.serversService.getServer(1);
      }
    );

    this.onQueryParamsChanged = this.route.queryParams.subscribe(
      (queryParams: Params) => {
        this.allowEdit = queryParams['allowEdit'] === '1';
      }
    );

    this.serverName = this.server.name;
    this.serverStatus = this.server.status;
  }

  ngOnDestroy() {
    this.onServerChanged.unsubscribe();
    this.onQueryParamsChanged.unsubscribe();
  }

  onUpdateServer() {
    this.serversService.updateServer(this.server.id, {name: this.serverName, status: this.serverStatus});
    this.changesSaved = true;
    this.router.navigate(['../'], { relativeTo : this.route })
  }

  canDeactivate() : Observable<boolean> | Promise<boolean> | boolean {
    if(!this.allowEdit) {
      return true;
    }
    if((this.serverName !== this.server.name || this.serverStatus !== this.server.status) &&
        !this.changesSaved) {
          return confirm('Do you want to discard changes?');
        } else {
          return true;
        }
  }

}
