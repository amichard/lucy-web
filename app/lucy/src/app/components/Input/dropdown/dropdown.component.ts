import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormMode } from 'src/app/models';
import { DropdownObject } from 'src/app/services/dropdown.service';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Bank {
  id: string;
  name: string;
 }
@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  /** control for the selected option */
  public optionCtrl: FormControl = new FormControl();

   /** control for the MatSelect filter keyword */
  public optionFilterCtrl: FormControl = new FormControl();

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  @Input() fieldHeader = ``;
  // Optional Input
  @Input() editable = true;

  get fieldId(): string {
    return this.camelize(this.fieldHeader);
  }

  ///// Form Mode
  private _mode: FormMode = FormMode.View;
  // Get
  get mode(): FormMode {
    return this._mode;
  }
  // Set
  @Input() set mode(mode: FormMode) {
    this._mode = mode;
  }
  ////////////////////

  get readonly(): boolean {
    if (this.mode === FormMode.View) {
      return true;
    } else {
      return !this.editable;
    }
  }

  ///// Selected item
  private _selectedItem: DropdownObject;
  // Get selected item
  get selectedItem(): DropdownObject {
    return this._selectedItem;
  }
  // Set selected item
  @Input() set selectedItem(item: DropdownObject) {
    if (!item) { return; }
    this._selectedItem = item;
    if (item) {
      this.selectionChanged.emit(item);
    }
  }
  ////////////////////

  private _selectedItemName: string;
  set selectedItemName(name: string) {
    this._selectedItemName = name;
  }

  get selectedItemName(): string {
    if (this.selectedItem) {
      return this.selectedItem.name;
    } else {
      return ``;
    }
  }

  ///// Items list
  private _items: DropdownObject[] = [];
  // Get items
  get items(): DropdownObject[] {
    return this._items;
  }
  // Set items
  @Input() set items(array: DropdownObject[]) {
    this.filteredItems = array;
    this._items = array;
  }
  ////////////////////

  ///// Items list
  private _filteredItems: DropdownObject[] = [];
  // Get filtered items
  get filteredItems(): DropdownObject[] {
    return this._filteredItems;
  }
  // Set filtered
  set filteredItems(items: DropdownObject[]) {
    this._filteredItems = items;
  }
  ////////////////////

  // Response
  @Output() selectionChanged = new EventEmitter<DropdownObject>();

  constructor() { }

  ngOnInit() {
    // set initial selection
    // this.optionCtrl.setValue(this.items[0]);

    this.optionFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOptions();
      });
  }

  selected(item: DropdownObject) {
    this.selectedItem = item;
    this.selectionChanged.emit(this.selectedItem);
  }

  filterOptions() {
    if (!this.items) {
      return;
    }

    // get the search keyword
    let search = this.optionFilterCtrl.value;
    if (!search) {
      this.filteredItems = this.items;
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredItems = [];
    console.log(`searching`);
    for (const item of this.items) {
      if (item.name !== undefined && String(item.name).toLowerCase().includes(search.toLowerCase())) {
        this.filteredItems.push(item);
      }
    }
  }

  filer(string: string) {
    console.log(string);
    if (string === ``) {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = [];
      console.log(`searching`);
      for (const item of this.items) {
        if (item.name.toLowerCase().includes(string.toLowerCase())) {
          this.filteredItems.push(item);
        }
      }
    }
  }

  camelize(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

}
