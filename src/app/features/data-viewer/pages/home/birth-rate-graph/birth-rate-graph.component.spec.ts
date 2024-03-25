import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthRateGraphComponent } from './birth-rate-graph.component';

describe('BirthRateGraphComponent', () => {
  let component: BirthRateGraphComponent;
  let fixture: ComponentFixture<BirthRateGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthRateGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BirthRateGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
