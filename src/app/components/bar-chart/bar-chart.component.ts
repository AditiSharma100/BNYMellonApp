import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { ApiService } from '../../services/apiservice';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent implements OnInit, OnChanges {

  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  @Input() private showData: boolean;
  private margin: any = { top: 20, bottom: 20, left: 70, right: -600 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private tip: any;

  constructor(private apiService: ApiService) {

  }

  ngOnInit() {
    this.apiService.chartdata.subscribe(data => {
      if (data.length) {
        d3.select("svg").remove();
        this.createChart();
        this.data = data;
        this.updateChart();
      }


    });


  }



  ngOnChanges() {
    if (this.showData) {
      d3.select("svg").remove();
    }



  }


  createChart() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right - 800;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart plot area
    this.chart = svg.append('g')
      .attr('class', 'bars')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    const xDomain = this.data.map(d => d[0]);
    const yDomain = [0, d3.max(this.data, d => d[1])];

    // create scales
    this.xScale = d3.scaleBand().padding(0.5).domain(xDomain).rangeRound([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    // bar colors
    this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>["steelblue", "steelblue"]);
    console.log("inside the create chart");
    // x & y axis
    this.xAxis = svg.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis = svg.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));
  }

  updateChart() {
    // update scales & axis
    this.xScale.domain(this.data.map(d => d[0]));
    this.yScale.domain([0, d3.max(this.data, d => d[1] + 100)]);
    this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    const update = this.chart.selectAll('.bar')
      .data(this.data);

    // remove exiting bars
    update.exit().remove();

    // update existing bars
    this.chart.selectAll('.bar').transition(100)
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScale(d[1]))
      .style('fill', (d, i) => this.colors(i));



    // this.chart('mouseenter', function (actual, i) {
    //   d3.selectAll('.value')
    //     .attr('opacity', 0);
    // })
    // this.chart.on('mouseleave', function () {
    //   d3.selectAll('.value')
    //     .attr('opacity', 1)

    //   d3.selectAll(this)
    //     .transition()
    //     .duration(300)
    //     .attr('opacity', 1)
    //     .attr('x', (a) => this.xScale(a.language))
    //     .attr('width', this.xScale.bandwidth())

    //   this.chart.selectAll('#limit').remove()
    //   this.chart.selectAll('.divergence').remove()
    // })
    // this.chart.selectAll('.bar')
    //   .data(this.data)
    //   .enter().append('rect')
    //   .attr('class', 'bar')
    //   .attr('x', d => this.xScale(d[0]))
    //   .attr('width', 200)
    //   .attr('y', d => this.yScale(d[1]))
    //   .attr('height', d => {
    //     return this.height - this.yScale(d[1]);
    //   });

    this.chart.selectAll('text.bar')
      .data(this.data)
      .enter().append('text')
      .attr('class', 'bar')
      .attr('text-anchor', 'middle')
      .attr("font-family", "Saira")
      .attr("font-size", "15px")
      .attr("dy", "0 0.2 -0.1")
      .attr("fill", "steelblue")
      .attr('x', d => {
        return this.xScale(d[0]) + this.width / 25;
      })
      .attr('y', d => {
        return this.yScale(d[1]) - 5;
      })
      .text(d => {
        return d[1];
      });

    // this.chart.selectAll.append('path')
    //   .on("mouseover", function (d) {
    //     d3.select(this).attr('fill', 'black')
    //   })
    //   .on("mouseout", function (d) {
    //     d3.select(this).attr('fill', 'black')
    //   });
    // add new bars
    update
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(i))
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[1]))
      .attr('height', d => this.height - this.yScale(d[1]));
  }
}
