import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../core/services/client.service';
import { PlanService } from '../../core/services/plan.service';
import { MikrotikService } from '../../core/services/mikrotik.service';
import { forkJoin } from 'rxjs';

interface ChartItem {
  name: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalClients = 0;
  activeClients = 0;
  suspendedClients = 0;
  totalRouters = 0;
  connectedRouters = 0;
  disconnectedRouters = 0;
  totalPlans = 0;
  
  clientsByPlan: ChartItem[] = [];
  clientsByConnectionType: ChartItem[] = [];
  
  isLoading = true;
  
  constructor(
    private clientService: ClientService,
    private planService: PlanService,
    private mikrotikService: MikrotikService
  ) { }
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    
    forkJoin({
      clients: this.clientService.getClients(),
      plans: this.planService.getPlans(),
      routers: this.mikrotikService.getRouters()
    }).subscribe(
      results => {
        const { clients, plans, routers } = results;
        
        // Process client statistics
        this.totalClients = clients.length;
        this.activeClients = clients.filter(c => c.status === 'ACTIVE').length;
        this.suspendedClients = clients.filter(c => c.status === 'SUSPENDED').length;
        
        // Process router statistics
        this.totalRouters = routers.length;
        this.connectedRouters = routers.filter(r => r.status === 'ACTIVE').length;
        this.disconnectedRouters = routers.filter(r => r.status !== 'ACTIVE').length;
        
        // Process plan statistics
        this.totalPlans = plans.length;
        
        // Calculate clients by plan
        this.clientsByPlan = this.calculateClientsByPlan(clients, plans);
        
        // Calculate clients by connection type
        this.clientsByConnectionType = this.calculateClientsByConnectionType(clients);
        
        this.isLoading = false;
      },
      error => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    );
  }
  
  calculateClientsByPlan(clients: any[], plans: any[]): ChartItem[] {
    // Create a map of plan ids to names
    const planMap: {[key: string]: string} = {};
    plans.forEach(plan => {
      planMap[plan.id] = plan.name;
    });
    
    // Group clients by plan
    const planGroups: {[key: string]: ChartItem} = {};
    clients.forEach(client => {
      const planId = client.servicePlan.id;
      if (!planGroups[planId]) {
        planGroups[planId] = {
          name: planMap[planId],
          count: 0
        };
      }
      planGroups[planId].count++;
    });
    
    // Convert to array for chart
    return Object.values(planGroups);
  }
  
  calculateClientsByConnectionType(clients: any[]): ChartItem[] {
    const typeLabels: {[key: string]: string} = {
      'SIMPLE_QUEUE': 'Simple Queue',
      'PCQ': 'PCQ',
      'HOTSPOT': 'Hotspot',
      'PPPOE': 'PPPoE'
    };
    
    // Group clients by connection type
    const typeGroups: {[key: string]: ChartItem} = {};
    clients.forEach(client => {
      const type = client.connectionType;
      if (!typeGroups[type]) {
        typeGroups[type] = {
          name: typeLabels[type] || type,
          count: 0
        };
      }
      typeGroups[type].count++;
    });
    
    // Convert to array for chart
    return Object.values(typeGroups);
  }
}