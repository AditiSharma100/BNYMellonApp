import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/apiservice';
import {
  FormControl, FormBuilder, FormGroup, Validators,
  ValidatorFn, AbstractControl
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {Company} from '../../classes/companyClass';

declare let d3: any;
@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css']

})
export class MainWindowComponent implements OnInit {
  productCame = false;
  companyCame = false;
  everythingSet = false;
  dataLoading=true;
  dataNull= false;
  dataChanged=true;
  productControl = new FormControl();
  companyControl = new FormControl();
  productOptions: string[] = [];
  companyOptions: string[] = [];
  filteredCompOptions: Observable<string[]>;
  filteredProdOptions: Observable<string[]>;
  private chartData: Array<any>;
  dataSource: Company[];
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    this.apiService.getProductList().subscribe(
      data => {
        data.forEach((d) => {
          this.productOptions.push(d.title);
        });
        this.productCame = true;
      }
    );
    this.apiService.getCompanyList().subscribe(
      data => {
        data.forEach((d) => {
          this.companyOptions.push(d.title);
        });
        this.companyCame = true;
        this.everythingSet = true;
        this.dataLoading=false;
      }
    );

  }


  ngOnInit() {
    this.dataNull=false;
    this.filteredProdOptions = this.productControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._productsFilter(value))
      );
    this.productControl.setValidators([Validators.required,
    forbiddenNamesValidator(this.productOptions)
    ]);
    this.filteredCompOptions = this.companyControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._CompanyFilter(value))
      );
    this.companyControl.setValidators([Validators.required,
    forbiddenNamesValidator(this.companyOptions)
    ]);
  }

  private _CompanyFilter(value: string): string[] {
    this.dataNull=false;
    this.dataChanged=true;
    const filterValue = value.toLowerCase();
    return this.companyOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _productsFilter(value: string): string[] {
    this.dataNull=false;
    this.dataChanged=true;
    const filterValue = value.toLowerCase();
    return this.productOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  submit() {
   this.generateData(this.companyControl.value,this.productControl.value);
  }

  generateData(company,product) {
    this.chartData = [];
    this.apiService.getComplaintList(company,product).subscribe(data => {
      if(data == null || data == ''){
        this.dataNull=true;
        this.dataChanged=true;
      }
      else{
        this.dataSource = data;
        this.dataNull=false;
         this.dataChanged=false;
      this.dataSource.forEach(element => {
        this.chartData.push([
          element.response,
          element.outcomeCount
        ]);
      });
      this.apiService.updateChartData(this.chartData);
            }
      
      
    });
  }

}
export function forbiddenNamesValidator(names: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value == null || control.value == '') {
      return null;
    }
    // below findIndex will check if control.value is equal to one of our options or not
    const index = names.findIndex(name => {
      return (new RegExp('\^' + name + '\$')).test(control.value);
    });

    return index < 0 ? { 'forbiddenNames': { value: control.value } } : null;
  };
}


