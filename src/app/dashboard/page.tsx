import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth/session";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDashboardStats, getRecentActivity } from "@/lib/db/queries";

export default async function DashboardPage() {
  const user = await getSession();
  const stats = await getDashboardStats();
  const recentActivity = await getRecentActivity(5);
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/buyers">View All Buyers</Link>
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Buyers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBuyers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLeads}</div>
            <p className="text-xs text-muted-foreground">
              {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.growthRate > 0 ? '+' : ''}{stats.growthRate}% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        <Link href={`/buyers/${activity.buyerId}`} className="hover:underline">
                          {activity.buyer.firstName} {activity.buyer.lastName}
                        </Link>
                      </p>
                      <p className="text-muted-foreground">
                        {activity.action === 'created' ? 'Added as new buyer' : 
                         activity.action === 'updated' ? 'Updated buyer details' : 
                         activity.action === 'deleted' ? 'Deleted buyer' : activity.action}
                        {activity.user?.name && ` by ${activity.user.name}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start">
              <Link href="/buyers/new">
                <span>Add New Buyer</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/buyers?view=import">
                <span>Import Buyers</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}