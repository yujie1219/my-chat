import { Component } from '@angular/core';

@Component({
    template: `
    <div style="height:100%;">
        <div style="width:10%; height:100%; display:inline-block; vertical-align: top;">
            <user-label (menuChange)="this.selectedMenu=$event;"></user-label>
        </div>
        <div style="width:20%; height:100%; display:inline-block; vertical-align: top;">
            <comment-label *ngIf="this.selectedMenu==='comments'"></comment-label>
        </div>
        <div style="width:70%; height:100%; display:inline-block; vertical-align: top;">
        </div>
    </div>
    `
})
export class MainInterfaceComponent {
    public selectedMenu = 'comments';
}
