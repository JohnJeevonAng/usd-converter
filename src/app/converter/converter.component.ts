import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Mask } from '@fagnerlima/ng-mask';
import { RateService } from '../rate.service';
import { Rate } from '../rate';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
})
export class ConverterComponent implements OnInit {

  readonly maskMoney: string = '#0.00?reverse=true';
  public objectKeys = Object.keys;
  public selectedDate = new FormControl(new Date());
  public currencies = [];
  public alert = {
    message: null
  };
  public loading: boolean = false;
  public converted: any;
  public dateValidation = {
    min: null,
    max: new Date(),
  };
  public currency: number;
  public targetCurrency: string;
  public error;

  constructor(private _rateService: RateService) { }

  clearAlert() {
    setTimeout(() => {
      this.alert.message = null;
    }, 5000);
  }

  updateRates() {
    this.loading = true;
    this._rateService.updateRates()
      .subscribe(response => {
        this.alert = response;
        this.loading = false;
        this.clearAlert();
        if (!this.currencies.length) {
          this.currencies = response.currencies;
          const keys = Object.keys(response.currencies);
          this.targetCurrency = keys[0];
        }
      },
      error => this.error = error
    );
  }

  convert() {
    const serializedDate = (new Date(this.selectedDate.value)).toLocaleDateString();
    const request = {
      date: serializedDate,
      usd: this.currency,
      targetCurrency: this.targetCurrency
    };

    this._rateService.convertCurrency(request)
      .subscribe(response => {
        this.converted = {
          result: response.result,
          currency: this.targetCurrency,
          name: this.currencies[this.targetCurrency]
        };

        // this._rateService.submitResponse(response);
      });
  }

  init() {
    this.loading = true;
    this._rateService.init()
      .subscribe(response => {
        this.loading = false;
        this.currencies = response.currencies;
        this.dateValidation.min = new Date(response.startDate);
        const keys = Object.keys(response.currencies);
        this.targetCurrency = keys[0];
        this.alert.message = keys.length ? null : 'Click "Update rates" to fetch the latest currency rates.';
      });
  }

  ngOnInit() {
    this.init();
  }

}
