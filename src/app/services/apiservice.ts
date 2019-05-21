import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class ApiService {
    private chartdatasource = new ReplaySubject<any>();
    chartdata = this.chartdatasource.asObservable();
    constructor(private httpClient: HttpClient) {

    }
    getProductList(): Observable<any> {
        return this.httpClient
            .get("http://jayglovesdc.com:8080/bny/complaints/allProd");

    }

    getCompanyList(): Observable<any> {
        return this.httpClient
            .get("http://jayglovesdc.com:8080/bny/complaints/allComp");

    }

    getComplaintList(company,product): Observable<any> {
        return this.httpClient
            .get("http://jayglovesdc.com:8080/bny/complaints/combo/"+product+"/"+company);

    }

    updateChartData(data: any) {
        this.chartdatasource.next(data);
    }
}