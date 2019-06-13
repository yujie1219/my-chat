import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'user-label',
    templateUrl: './userLabel.component.html',
    styles: [`
        .user-label-container{
            background-color:darkslategrey;
            height: 100%;
        }

        .menu-container{
            width:80%;
            height: 150px;
            margin:0 auto;
            display: block;
            background: transparent;
            border: none;
            outline:none;
        }

        .fa{
            font-size: 70px;
        }
    `]
})
export class UserLabelComponent {
    public buttonNames: string[] = [
        'comments', 'user'
    ];
    public ngClassMap: Map<string, object> = new Map();
    private selectedMap: Map<string, boolean> = new Map();
    @Output()
    private menuChange = new EventEmitter<string>();

    constructor() {
        this.initMenu();
    }

    public itemSelected(itemName: string) {
        let oldSeleted;
        this.selectedMap.forEach((value, key) => {
            if (value) {
                oldSeleted = key;
            }
        });
        if (oldSeleted && oldSeleted !== itemName) {
            this.selectedMap.set(oldSeleted, !this.selectedMap.get(oldSeleted));
            this.selectedMap.set(itemName, !this.selectedMap.get(itemName));
            const oldNgClass = this.ngClassMap.get(oldSeleted);
            const currentNgClass = this.ngClassMap.get(itemName);
            const waitChange = [oldNgClass, currentNgClass];
            waitChange.forEach(item => {
                for (const name in item) {
                    if (name !== 'fa') {
                        item[name] = !item[name];
                    }
                }
            });
            this.menuChange.emit(itemName);
        }
    }

    private initMenu() {
        this.buttonNames.forEach((buttonName, index) => {
            this.selectedMap.set(buttonName, index === 0);

            let ngClass = {};
            switch (index) {
                case 0:
                    ngClass = {
                        fa: true,
                        'fa-comments': this.selectedMap.get(buttonName),
                        'fa-comments-o': !this.selectedMap.get(buttonName)
                    };
                    break;
                case 1:
                    ngClass = {
                        fa: true,
                        'fa-user': this.selectedMap.get(buttonName),
                        'fa-user-o': !this.selectedMap.get(buttonName)
                    };
                    break;
            }
            this.ngClassMap.set(buttonName, ngClass);
        });
    }
}
