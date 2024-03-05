import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarProvider {

  
  sidebarState = {
    isOpen: true,
    inTranisition: false,
    isLocked: true
  };


  public sideBarRenderListeners:BehaviorSubject<boolean>;
  public sideBarRender$obs:Observable<boolean>;

  constructor() {
    this.sideBarRenderListeners = new BehaviorSubject<boolean>(false);
    this.sideBarRender$obs = this.sideBarRenderListeners.asObservable();
   }

  mutateLock() {

    if(this.sidebarState.isLocked && this.sidebarState.isOpen) {
      this.sidebarState.isLocked = false;
      this.mutateSidebar();
      return;
    }
      this.sidebarState.isLocked = !this.sidebarState.isLocked;
  }

 
  mutateSidebar() {

    if (this.sidebarState.inTranisition || this.sidebarState.isLocked)
      return;

    this.sidebarState.inTranisition = true;
    this.sidebarState.isOpen = !this.sidebarState.isOpen;


    setTimeout(() => {
      this.sidebarState.inTranisition = false;
    }, 250)


  }

}
