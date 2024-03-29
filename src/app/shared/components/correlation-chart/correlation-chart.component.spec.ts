import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelationChartComponent } from './correlation-chart.component';

describe('CorrelationChartComponent', () => {
  let component: CorrelationChartComponent;
  let fixture: ComponentFixture<CorrelationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrelationChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorrelationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
