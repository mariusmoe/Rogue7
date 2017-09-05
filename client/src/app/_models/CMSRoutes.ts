import { Component } from '@angular/core';
import { OutletComponent } from '../base-module/outlet-component/outlet.component';
import { CanActivate } from '@angular/router';

export interface CMSRoutes {
    path: RoutePath;
    children?: [CMSRoutes];
}


interface RoutePath {
  component?: Component;
  loadChildren?: string;
  redirectTo?: string;
  pathMatch?: string;
  canActivate?: [CanActivate];
}
