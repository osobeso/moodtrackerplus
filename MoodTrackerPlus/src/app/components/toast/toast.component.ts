import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  standalone: false,
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() emoji: string = '';
  @Input() show: boolean = false;
  @Output() revert = new EventEmitter<void>();

  onRevert(): void {
    this.revert.emit();
  }
}
