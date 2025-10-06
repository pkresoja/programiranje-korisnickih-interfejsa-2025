import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class Utils {
  public bootstrapClasses = {
    popup: 'card',
    cancelButton: 'btn btn-danger',
    denyButton: 'btn btn-secondary',
    confirmButton: 'btn btn-primary'
  }

  public getImage(dest: string) {
    return `https://img.pequla.com/destination/${dest.split(' ')[0].toLowerCase()}.jpg`
  }

  public formatDate(iso: string) {
    return new Date(iso).toLocaleString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  public showAlert(text: string) {
    Swal.fire({
      titleText: text,
      customClass: this.bootstrapClasses
    })
  }

  public showError(message: string) {
    Swal.fire({
      title: "Oops, an error occured!",
      confirmButtonText: 'Close',
      text: message,
      icon: "error",
      customClass: this.bootstrapClasses
    })
  }

  public showConfirm(message: string, callback: Function) {
    Swal.fire({
      title: message,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      icon: "question",
      customClass: this.bootstrapClasses
    }).then(result => {
      if (result.isConfirmed) {
        callback()
        Swal.fire({
          title: "Success",
          confirmButtonText: 'Close',
          icon: "success",
          customClass: this.bootstrapClasses
        })
      }
    })
  }

  public showLoading() {
    Swal.fire({
      title: "Please wait",
      text: "We are fetching the latest data from our servers!",
      customClass: this.bootstrapClasses,
      didOpen: () => {
        Swal.showLoading()
      }
    })
  }
}
