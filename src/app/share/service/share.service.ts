import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ErrorModalComponent } from '../component/modal/errorModal.component';

@Injectable()
export class ShareService {
    constructor(private modalService: BsModalService) { }

    public openErrorModal(errorTitle: string, errorMessage: string) {
        const errorModalRef = this.modalService.show(ErrorModalComponent);
        if (errorMessage && errorMessage.trim().length > 0) {
            errorModalRef.content.errorMessage = errorMessage;
        }
        if (errorTitle && errorTitle.trim().length > 0) {
            errorModalRef.content.errorTitle = errorTitle;
        }
    }
}
